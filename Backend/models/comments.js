import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        target: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "targetModel",
        },

        targetModel: {
            type: String,
            required: true,
            enum: ["Post", "Project"],
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Comment = mongoose.model("Comment",commentSchema);