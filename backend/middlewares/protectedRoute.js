import User from "../models/userModel.js"
import jwt from 'jsonwebtoken'

export const protectedRoute = async (req, res, next) => {
   
   try {
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ error: "Not token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
        return res.status(401).json({ error: "Invalid token" })
    }

   const user = await User.findById(decoded.userId).select("-password")

    if(!user) {
        return res.status(401).json({ error: "User not found" })
    }
    req.user = user
    next()
   } catch (error) {
    res.status(500).json({ error: error.message })
   }
   

}