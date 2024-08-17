import express from 'express'
import { protectedRoute } from '../middlewares/protectedRoute.js'
import {
    followUnfollowUser,
    getUserProfile,
    suggestedUsers,
    updateUserProfile
} from '../controllers/userController.js'

const router = express.Router()

router
    .get("/profile/:username",protectedRoute,getUserProfile)
    .get("/suggested",protectedRoute,suggestedUsers)
    .post("/follow/:id",protectedRoute,followUnfollowUser)
    .post("/update",protectedRoute,updateUserProfile)

export default router