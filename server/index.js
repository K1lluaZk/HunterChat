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

const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  }
})

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

// Inicialización de la tabla con timestamp
await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    user TEXT DEFAULT 'Anónimo',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

app.use(logger('dev'))
app.use(express.static('client'))

io.on('connection', async (socket) => {
  console.log('✅ Usuario conectado')

  // Enviar historial al cliente cuando lo pida
  socket.on('get history', async () => {
    try {
      const results = await db.execute('SELECT id, content, user, timestamp FROM messages ORDER BY id DESC LIMIT 50')
      socket.emit('load history', results.rows.reverse())
    } catch (e) {
      console.error("Error al cargar historial:", e)
    }
  })

  // Recibir y guardar mensaje
  socket.on('chat message', async (msg, username = 'Anónimo') => {
    if (!msg?.trim()) return 

    try {
      const result = await db.execute({
        sql: 'INSERT INTO messages (content, user) VALUES (:msg, :user)',
        args: { msg, user: username }
      })
      
      // Recuperamos el timestamp que SQLite generó automáticamente
      const newMessage = await db.execute({
        sql: 'SELECT timestamp FROM messages WHERE id = ?',
        args: [result.lastInsertRowid.toString()]
      })

      io.emit('chat message', msg, result.lastInsertRowid.toString(), username, newMessage.rows[0].timestamp)
    } catch (e) {
      console.error("Error al guardar mensaje:", e)
    }
  })
})

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`server running in port ${port}`)
})