import express from 'express'
import dotenv from 'dotenv'


// Database
import connectDB from './models/connectMongoDB.js'

// Routes
import authRoutes from './routes/authRoutes.js'


dotenv.config()
const app = express()

connectDB()


app.use("/api/auth", authRoutes)




app.listen(5000, () => console.log('Server started on port 5000'))