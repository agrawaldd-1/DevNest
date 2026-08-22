import api from "./api.js";

export const getConversations = async () => {
    const response = await api.get("/messages");
    return response.data;
};

export const getAllMessages = async (targetId) => {
    const response = await api.get(`/messages/${targetId}`);
    return response.data;
};

export const searchUsers = async (query) => {
    const response = await api.get(
        `/search?query=${encodeURIComponent(query)}`
    );

    return response.data;
};