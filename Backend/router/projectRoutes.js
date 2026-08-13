import express from "express";
import {
    createProject,
    editProject,
    deleteProject,
    getAllProjects,
    viewProject,
    getUserProjects,
} from "../controllers/projectControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import uploadProject from "../middleware/uploadProjectMiddleware.js";

const router = express.Router();

router.post(
    "/create",
    protect,
    uploadProject.fields([
        {
            name: "images",
            maxCount: 10,
        },
        {
            name: "video",
            maxCount: 1,
        },
    ]),
    createProject
);

router.put(
    "/:projectId",
    protect,
    editProject
);

router.delete(
    "/:projectId",
    protect,
    deleteProject
);

router.get(
    "/",
    getAllProjects
);

router.get(
    "/user/:userId",
    getUserProjects
);

router.get(
    "/:projectId",
    viewProject
);

export default router;