import mongoose from "mongoose";

const shortSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        caption: {
            type: String,
            default: "",
            trim: true,
        },

        video: {
            type: String,
            required: true,
        },

        videoPublicId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Short = mongoose.model(
    "Short",
    shortSchema
);