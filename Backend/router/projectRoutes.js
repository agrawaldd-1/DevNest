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
    protect,
    getAllProjects
);

router.get(
    "/user/:userId",
    getUserProjects
);

router.get(
    "/:projectId",
    protect,
    viewProject
);

export default router;