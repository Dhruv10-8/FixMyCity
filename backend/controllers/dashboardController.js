const User = require('../models/User')

exports.getUserDetails = async (req, res) => {
    if (!req.user){
        return res.status(404).json({message: "No User Exists"})
    }
    // console.log('User in dashboard', req.user)
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password')
        if (!user){
            return res.status(404).json({message: "User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"})
    }
}