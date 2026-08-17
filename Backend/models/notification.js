import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: [
            "LIKE",
            "COMMENT",
            "CONNECTION_REQUEST",
            "CONNECTION_ACCEPTED"
        ],
        required: true
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    referenceType: {
        type: String,
        enum: ["Post", "Project", "Short"],
        default: null
    },
    
}, {
    timestamps: true
});

export const Notification = mongoose.model("Notification", notificationSchema);