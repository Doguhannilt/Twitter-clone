import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// Database
import connectDB from './models/connectMongoDB.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

import {v2 as cloudinary} from 'cloudinary'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const app = express()

connectDB()

app.use(cookieParser())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

{/* Routes */}
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)




app.listen(5000, () => console.log('Server started on port 5000'))