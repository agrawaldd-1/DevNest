import api from "./api.js";

export const sendConnectionRequest = async (targetId) => {
    const response = await api.post(`/connections/request/${targetId}`);
    return response.data;
};

export const acceptConnectionRequest = async (connectionId) => {
    console.log("ACCEPT CONNECTION ID:", connectionId);
    const response = await api.patch(`/connections/accept/${connectionId}`);
    return response.data;
};

export const rejectConnectionRequest = async (connectionId) => {
    console.log("REJECT CONNECTION ID:", connectionId);
    const response = await api.patch(`/connections/reject/${connectionId}`);
    return response.data;
};

export const getAllConnections = async () => {
    const response = await api.get("/connections");
    return response.data;
};
export const getConnectionStatus = async (targetId) => {
    const response = await api.get(`/connections/status/${targetId}`);
    return response.data;
};