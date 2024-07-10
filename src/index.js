import cors from 'cors'
import express, { json } from 'express'
import 'dotenv/config'
import path from "path"
import { fileURLToPath } from 'url';
import { config } from './config/index.js'
import { startDb } from './config/mongo.js'
import { usersRoutes } from './routes/users.js'
import { courseRouter } from './routes/course.js'
import { backupRouter } from './routes/backup.js'
import { roomRouter } from './routes/rooms.js';
import { meetRouter } from './routes/meets.js';
import { reportRouter } from './routes/reports.js';
const app = express()

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(config.PORT, () => {
  console.log(`SERVER RUNNING ON PORT: ${config.PORT}`)
})
app.use(cors())
app.use(json({ limit: '2mb' }))

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  console.log(`Request Type: ${req.method} to ${req.url}`);
  next();
})

app.use('/users', usersRoutes)
app.use('/course', courseRouter)
app.use('/backup', backupRouter)
app.use('/room', roomRouter)
app.use('/meet', meetRouter)
app.use('/report', reportRouter)


await startDb()