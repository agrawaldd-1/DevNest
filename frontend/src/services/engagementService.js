import api from "./api.js";

export const toggleLike = async (
    targetType,
    targetId
) => {
    const token = localStorage.getItem("token");

    const response = await api.post(
        `/engagement/${targetType}/${targetId}/like`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const addComment = async (
    targetType,
    targetId,
    content
) => {
    const token = localStorage.getItem("token");

    const response = await api.post(
        `/engagement/${targetType}/${targetId}/comments`,
        {
            content,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getComments = async (
    targetType,
    targetId
) => {
    const response = await api.get(
        `/engagement/${targetType}/${targetId}/comments`
    );

    return response.data;
};