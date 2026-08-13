import { User } from "../models/user.js";
import { Project } from "../models/project.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (file, resourceType, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
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
            .createReadStream(file.buffer)
            .pipe(uploadStream);
    });
};

export const createProject = async (req, res) => {
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

        const {
            title,
            description,
            techStack,
            links,
            mediaType,
        } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project title is required",
            });
        }

        if (!description?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project description is required",
            });
        }

        if (
            !mediaType ||
            !["images", "video"].includes(mediaType)
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid media type is required",
            });
        }

        let parsedTechStack = [];

        if (techStack) {
            try {
                parsedTechStack =
                    typeof techStack === "string"
                        ? JSON.parse(techStack)
                        : techStack;

                if (!Array.isArray(parsedTechStack)) {
                    return res.status(400).json({
                        success: false,
                        message: "Tech stack must be an array",
                    });
                }
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid tech stack format",
                });
            }
        }

        let parsedLinks = [];

        if (links) {
            try {
                parsedLinks =
                    typeof links === "string"
                        ? JSON.parse(links)
                        : links;

                if (!Array.isArray(parsedLinks)) {
                    return res.status(400).json({
                        success: false,
                        message: "Links must be an array",
                    });
                }

                for (const link of parsedLinks) {
                    if (
                        !link?.title?.trim() ||
                        !link?.url?.trim()
                    ) {
                        return res.status(400).json({
                            success: false,
                            message:
                                "Each link must contain title and url",
                        });
                    }
                }
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid links format",
                });
            }
        }

        const imageFiles =
            req.files?.images || [];

        const videoFiles =
            req.files?.video || [];

        if (mediaType === "images") {
            if (imageFiles.length === 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "At least one project image is required",
                });
            }

            if (videoFiles.length > 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Project cannot contain images and video together",
                });
            }
        }

        if (mediaType === "video") {
            if (videoFiles.length !== 1) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Only one project video is allowed",
                });
            }

            if (imageFiles.length > 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Project cannot contain images and video together",
                });
            }
        }

        let images = [];
        let imagePublicIds = [];

        let video = "";
        let videoPublicId = "";

        if (mediaType === "images") {
            for (const file of imageFiles) {
                const uploadResult =
                    await uploadToCloudinary(
                        file,
                        "image",
                        "skillsync/projects/images"
                    );

                images.push(
                    uploadResult.secure_url
                );

                imagePublicIds.push(
                    uploadResult.public_id
                );
            }
        }

        if (mediaType === "video") {
            const uploadResult =
                await uploadToCloudinary(
                    videoFiles[0],
                    "video",
                    "skillsync/projects/videos"
                );

            video =
                uploadResult.secure_url;

            videoPublicId =
                uploadResult.public_id;
        }

        const project = await Project.create({
            userId: id,
            title: title.trim(),
            description: description.trim(),
            techStack: parsedTechStack,
            links: parsedLinks,
            mediaType,
            images,
            imagePublicIds,
            video,
            videoPublicId,
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create project",
            error: error.message,
        });
    }
};
export const editProject = async (req, res) => {
    try {
        const { id } = req.user;
        const { projectId } = req.params;

        const {
            title,
            description,
            techStack,
        } = req.body;

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

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (project.userId.toString() !== id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this project",
            });
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Project title cannot be empty",
                });
            }

            project.title = title.trim();
        }

        if (description !== undefined) {
            if (!description.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Project description cannot be empty",
                });
            }

            project.description = description.trim();
        }

        if (techStack !== undefined) {
            let parsedTechStack;

            try {
                parsedTechStack =
                    typeof techStack === "string"
                        ? JSON.parse(techStack)
                        : techStack;

                if (!Array.isArray(parsedTechStack)) {
                    return res.status(400).json({
                        success: false,
                        message: "Tech stack must be an array",
                    });
                }
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid tech stack format",
                });
            }

            project.techStack = parsedTechStack;
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update project",
            error: error.message,
        });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.user;
        const { projectId } = req.params;

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

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (project.userId.toString() !== id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this project",
            });
        }

        if (project.imagePublicIds?.length > 0) {
            for (const publicId of project.imagePublicIds) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        if (project.videoPublicId) {
            await cloudinary.uploader.destroy(
                project.videoPublicId,
                {
                    resource_type: "video",
                }
            );
        }

        await Project.findByIdAndDelete(projectId);

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete project",
            error: error.message,
        });
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;

        const skip = (page - 1) * limit;

        const totalProjects = await Project.countDocuments();

        const projects = await Project.find()
            .populate("userId", "username image")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalProjects / limit);

        return res.status(200).json({
            success: true,
            count: projects.length,
            projects,
            currentPage: page,
            totalPages,
            hasMore: page < totalPages,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const viewProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project Id not found",
            });
        }

        const project = await Project.findById(projectId)
            .populate("userId", "username image");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project fetched successfully",
            project,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getUserProjects = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Id not found",
            });
        }

        const projects = await Project.find({
            userId,
        })
            .populate("userId", "username image")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};