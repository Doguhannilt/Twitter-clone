import Notification from "../models/notificationModel.js"

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id
        
        const notifications = await Notification.find({to: userId}).sort({createdAt: -1}).populate({
            path: "from",
            select: "username profileImg"
        })

        await Notification.updateMany({ to: userId }, { read: true })
        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const notificationId = req.params.id
        const userId = req.user._id
        const notification = await Notification.findById(notificationId)

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" })
        }
        if (notification.to.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        await Notification.findByIdAndDelete(notificationId)
        res.status(200).json({ message: "Notification deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
}
