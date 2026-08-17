import { Notification } from "../models/Notification.js";
import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import { Project } from "../models/project.js";
import { Short } from "../models/shorts.js";
import { Like } from "../models/likes.js";
import { Comment } from "../models/comments.js";

export const createNotification = async ({
    sender,
    recipient,
    type,
    referenceId,
    referenceType
}) => {
    
};