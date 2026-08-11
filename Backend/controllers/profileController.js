import { User } from "../models/user.js"

export const fetchProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Id is not given"
            })
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}