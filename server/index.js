import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config()

const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
const io = new Server(server, { connectionStateRecovery: {} })

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    user TEXT DEFAULT 'Anónimo',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    reply_content TEXT,
    reply_user TEXT
  )
`)

app.use(logger('dev'))
app.use(express.static('client'))

io.on('connection', async (socket) => {
  
  socket.on('get history', async () => {
    const results = await db.execute("SELECT *, strftime('%Y-%m-%dT%H:%M:%SZ', timestamp) as timestamp FROM messages ORDER BY id DESC LIMIT 50")
    socket.emit('load history', results.rows.reverse())
  })

  socket.on('chat message', async (msg, username, replyData = null) => {
    if (!msg?.trim()) return 
    try {
      const result = await db.execute({
        sql: 'INSERT INTO messages (content, user, reply_content, reply_user) VALUES (?, ?, ?, ?)',
        args: [msg, username, replyData?.content || null, replyData?.user || null]
      })
      
      const row = await db.execute({
        sql: "SELECT *, strftime('%Y-%m-%dT%H:%M:%SZ', timestamp) as timestamp FROM messages WHERE id = ?",
        args: [result.lastInsertRowid.toString()]
      })

      io.emit('chat message', row.rows[0])
    } catch (e) { console.error(e) }
  })

  socket.on('delete message', async (id, username) => {
    try {
      const check = await db.execute({
        sql: 'SELECT user FROM messages WHERE id = ?',
        args: [id]
      })

      if (check.rows[0]?.user === username) {
        await db.execute({ sql: 'DELETE FROM messages WHERE id = ?', args: [id] })
        io.emit('message deleted', id)
      }
    } catch (e) { console.error(e) }
  })
})

server.listen(port, () => {
  console.log(`server running in port ${port}`)
})