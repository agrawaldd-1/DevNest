import { User, availableSkills } from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const fetchProfile = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User Id is not given",
            });
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const editProfile = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User Id is not given",
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const { username, bio, skills } = req.body;

        if (username !== undefined) {
            user.username = username.trim();
        }

        if (bio !== undefined) {
            user.bio = bio.trim();
        }

        if (skills !== undefined) {
            let parsedSkills;

            try {
                parsedSkills = Array.isArray(skills)
                    ? skills
                    : JSON.parse(skills);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid skills format",
                });
            }

            if (!Array.isArray(parsedSkills)) {
                return res.status(400).json({
                    success: false,
                    message: "Skills must be an array",
                });
            }

            const invalidSkills = parsedSkills.filter(
                (skill) => !availableSkills.includes(skill)
            );

            if (invalidSkills.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "One or more selected skills are invalid",
                    invalidSkills,
                });
            }

            user.skills = [...new Set(parsedSkills)];
        }

        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "skillsync/profiles",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                streamifier
                    .createReadStream(req.file.buffer)
                    .pipe(uploadStream);
            });

            user.image = uploadResult.secure_url;
        }

        const updatedUser = await user.save();

        const userResponse = updatedUser.toObject();

        delete userResponse.password;

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: userResponse,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};