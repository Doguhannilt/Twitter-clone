import { generateTokenandSetCookie } from "../library/generateTokenandSetCookie.js"
import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'


export const Signup = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body

        // validations
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        // check for duplicate usernames in the db
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" })
        }

        // check for duplicate emails in the db
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateTokenandSetCookie(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                fullName: newUser.fullname,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,
                link: newUser.link,
                followers: newUser.followers,
                following: newUser.following
            })
        }
        else {
            res.status(400).json({ error: "Invalid user data" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


export const Login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" })
    }

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        generateTokenandSetCookie(user._id, res)
        res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullname,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link,
            followers: user.followers,
            following: user.following
        })
    }
    else {
        res.status(400).json({ error: "Invalid email or password" })
    }


}
export const Logout = async (req, res) => {
    try {
        res.clearCookie("jwt")
        res.status(200).json({ message: "Logged out successfully" })
    
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

export const getAuthenticatedUser = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("-password")
        
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullname,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link,
            followers: user.followers,
            following: user.following
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


