import User from '../models/userModel.js'
import {v2 as cloudinary} from 'cloudinary'
import Post from '../models/postModel.js'
import Notification from '../models/notificationModel.js'

export const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body
        
        const userId = req.user._id.toString()

        const user = await User.findById(userId)
        if(!user) {
            return res.status(404).json({ error: "User not found" })
        }
        if (!text && !img) {
            return res.status(400).json({ error: "Please provide text or image" })
        }

        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }
        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save()
        res.status(201).json({ message: "Post created successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
        
    }
}


export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)            
        }

        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params
        const userId = req.user._id

        const post = await Post.findById(postId)
        if(!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        const userLikedPost = post.likes.includes(userId)

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
            res.status(200).json({ message: "Post unliked successfully" })
        } else {
            post.likes.push(userId)
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save()
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
               
            })
            await notification.save()
            res.status(200).json({ message: "Post liked successfully" })
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
}

export const commentPost = async (req, res) => {
    try {
        const { text } = req.body
        const postId = req.params.id
        const userId = req.user._id

        if (!text) {
            return res.status(400).json({ error: "Please provide text" })
        }

        const post = await Post.findById(postId)
        if(!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        const newComment = {
            user: userId,
            text
        }    
        post.comments.push(newComment)
        await post.save()
        res.status(201).json({ message: "Comment created successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        })
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
}

export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if(!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        })
        res.status(200).json(likedPosts)
        
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const following = user.following
        const feedPosts = await Post.find({ user: { $in: following } }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        
        })
        res.status(200).json(feedPosts)

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }

}

export const getUserPosts = async (req, res) => { 
    try {
        const { username } = req.params
        const user = await User.findOne({ username })
        if(!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        })
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }
}