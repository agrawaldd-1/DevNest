import api from "./api.js";

export const getNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};