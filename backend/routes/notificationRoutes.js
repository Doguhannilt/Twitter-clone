import express from 'express'
import { protectedRoute } from '../middlewares/protectedRoute.js'
import { deleteNotifications, getNotifications } from '../controllers/notificationsContoller.js'

const router = express.Router()

router.get("/", protectedRoute, getNotifications)
router.delete("/", protectedRoute, deleteNotifications)


export default router