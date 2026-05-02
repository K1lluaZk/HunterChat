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
    url: process.env.DB_URL || "libsql://deep-atom-k1lluazk.aws-us-east-1.turso.io",
    authToken: process.env.DB_TOKEN
})

// Inicialización de la DB
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
    console.log('Usuario conectado')

    const serverOffset = socket.handshake.auth.serverOffset ?? 0
    
    try {
        let results;
        if (serverOffset > 0) {
            results = await db.execute({ 
                sql: 'SELECT id, content, user FROM messages WHERE id > ?',
                args: [serverOffset]
            })
        } else {
            results = await db.execute('SELECT id, content, user FROM messages ORDER BY id DESC LIMIT 30')
            results.rows.reverse() 
        }
        
        results.rows.forEach(row => {
            socket.emit('chat message', row.content, row.id.toString(), row.user)
        })
    } catch (e) {
        console.error("Error cargando historial:", e)
    }

    socket.on('chat message', async (msg, username = 'Anónimo') => {
        if (!msg || !msg.trim()) return 

        try {
            const result = await db.execute({
                sql: 'INSERT INTO messages (content, user) VALUES (:msg, :user)',
                args: { msg, user: username }
            })
            
            io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
        } catch (e) {
            console.error("Error al guardar mensaje:", e)
        }
    })

    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })
}) 

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
    console.log(`HunterChat is running in http://localhost:${port}`)
})