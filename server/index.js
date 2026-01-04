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
    url: "libsql://deep-atom-k1lluazk.aws-us-east-1.turso.io",
    authToken: process.env.DB_TOKEN
})

await db.execute(`
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
)`)




io.on('connection', async (socket) => {
    console.log('a user has connected!')

    socket.on('disconnect', () => {
        console.log('an user has disconnected')
    })

    socket.on('chat message', async (msg) => {
        let result
        try {
            result = await db.execute({
               sql: 'INSERT INTO messages (content) VALUES (:msg)',
               args: { msg }
            })
        } catch (e) {
          console.error(e)
          return        
        }   

console.log("auth")
 console.log(socket.handshake.auth)

        io.emit('chat message', msg, result.lastInsertRowid.toString())
        })

        if (!socket.recovered) {
            try {
                const res = await db.execute({ 
                    sql: 'SELECT id,, content FROM messages where id > ?',
                    args: [0]
                })
             } catch (e) {
                console.error(e)

             }
        }
    })

app.use(logger('dev'))


app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

