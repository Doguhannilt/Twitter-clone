import Notification from "../models/notificationModel.js"
import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'


export const getUserProfile = async (req, res) => {
    const { username } = req.params

    try {
        const user = await User.findOne({ username }).select("-password")
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
        console.log(err)
    }
}

export const suggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the users followed by the current user
        const usersFollowedByCurrentUser = await User.findById(userId).select("following");

        // Use aggregate to match users and sample 10 random users
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            { $sample: { size: 10 } },
        ]);

        // Filter out users that are already followed by the current user
        const filteredUsers = users.filter(user =>
            !usersFollowedByCurrentUser.following.includes(user._id)
        );

        // Select the top 4 suggested users
        const suggestedUsers = filteredUsers.slice(0, 4);

        // Remove password from the user objects before sending the response
        suggestedUsers.forEach(user => user.password = null);

        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};


export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "Cannot follow yourself" })
        }

        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: "User not found" })
        }

        const isFollowing = currentUser.following.includes(id)

        if (isFollowing) {
            // unfollowing
            await User.findByIdAndUpdate(id, {
                $pull: { followers: req.user._id },
            })
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: id },
            })
            const newNotification = new Notification({
                from: req.user._id,
                to: id,
                type: "follow",
                read: false
            })
            await newNotification.save()
            res.status(200).json({ message: "Unfollowed successfully" })
        } else {
            // following
            await User.findByIdAndUpdate(id, {
                $push: { followers: req.user._id },
            })
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id },
            })
            const newNotification = new Notification({
                from: req.user._id,
                to: id,
                type: "follow",
                read: false
            })
            await newNotification.save()
            res.status(200).json({ message: "Followed successfully" })
        }


    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
}


export const updateUserProfile = async (req, res) => {
    try {

        let { fullname, currentPassword, newPassword, email, username, bio, link } = req.body
        let { profileImg, coverImg } = req.body

        const userId = req.user._id

        const user = await User.findById(userId)


        if (!userId) {
            return res.status(404).json({ error: "User not found" })
        }

        if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({ error: "Please provide both current and new password" })
        }

        if (newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)

            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" })
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            user.password = hashedPassword
            res.status(200).json({ message: "Password changed successfully" })
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader(profileImg)
            profileImg = uploadedResponse.secure_url
        }
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader(coverImg)
            coverImg = uploadedResponse.secure_url
        }

        user.fullname = fullname || user.fullname
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save()
        user.password = null
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }

}