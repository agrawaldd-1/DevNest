import api from "../services/api.js";

export const createPost = async (formData) => {
    const token = localStorage.getItem("token");

    const response = await api.post(
        "/posts/create",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getAllPosts = async (page = 1) => {
    const response = await api.get(
        `/posts?page=${page}`
    );

    return response.data;
};

export const viewPost = async (postId) => {
    const token = localStorage.getItem("token");

    const response = await api.get(
        `/posts/${postId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};