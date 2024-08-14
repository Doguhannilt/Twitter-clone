import express from 'express'
import dotenv from 'dotenv'


// Database
import connectDB from './models/connectMongoDB.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'


dotenv.config()
const app = express()

connectDB()

app.use(cookieParser())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use("/api/auth", authRoutes)




app.listen(5000, () => console.log('Server started on port 5000'))