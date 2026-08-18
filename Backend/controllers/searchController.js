import { User } from "../models/User.js";
import { Project } from "../models/project.js";

export const searchBar = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query is required",
            });
        }

        const search = query.trim();

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Query is empty",
            });
        }

        if (search[0] === "#") {
            const skill = search.slice(1).trim();

            if (!skill) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a skill after #",
                });
            }

            const projects = await Project.find({techStack: {$regex: skill,$options: "i",},});

            if (projects.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Project containing that skill not found",
                });
            }

            return res.status(200).json({
                success: true,
                type: "project",
                count: projects.length,
                projects,
            });
        }

        const developers = await User.find({username: {$regex: search,$options: "i",},}).select("-password");

        if (developers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Developer not found",
            });
        }

        return res.status(200).json({
            success: true,
            type: "developer",
            count: developers.length,
            developers,
        });

    } catch (error) {
        console.error("Search error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while searching",
        });
    }
};