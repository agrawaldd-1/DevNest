import api from "./api.js";

export const createProject = async (formData) => {
    const response = await api.post(
        "/projects",
        formData
    );

    return response.data;
};

export const getAllProjects = async (page = 1) => {
    const response = await api.get(
        `/projects?page=${page}`
    );

    return response.data;
};

export const viewProject = async (projectId) => {
    const token = localStorage.getItem("token");

    const response = await api.get(
        `/projects/${projectId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getUserProjects = async (userId) => {
    const response = await api.get(
        `/projects/user/${userId}`
    );

    return response.data;
};

export const editProject = async (
    projectId,
    projectData
) => {
    const response = await api.put(
        `/projects/${projectId}`,
        projectData
    );

    return response.data;
};

export const deleteProject = async (projectId) => {
    const response = await api.delete(
        `/projects/${projectId}`
    );

    return response.data;
};