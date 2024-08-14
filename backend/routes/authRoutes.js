import express from 'express'
import {
    Login,
    Logout,
    Signup,
    getAuthenticatedUser
} from '../controllers/authController.js'
import { protectedRoute } from '../middlewares/protectedRoute.js'


const router = express.Router()


router.post("/signup", Signup)
router.post("/login", Login)
router.get("/logout", Logout)
router.get("/authenticated", protectedRoute, getAuthenticatedUser)

export default router