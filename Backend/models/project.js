import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        techStack: {
            type: [String],
            default: [],
        },

        links: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true,
                },

                url: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],

        mediaType: {
            type: String,
            enum: ["images", "video"],
            required: true,
        },

        images: {
            type: [String],
            default: [],
        },

        imagePublicIds: {
            type: [String],
            default: [],
        },

        video: {
            type: String,
            default: "",
        },

        videoPublicId: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export const Project = mongoose.model(
    "Project",
    projectSchema
);