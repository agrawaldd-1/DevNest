import api from "./api";

export const registerUser = async (data) => {
    const response = await api.post("/auth/register", data);

    return response.data;
};

export const loginUser = async (data) => {
    const response = await api.post("/auth/login", data);

    return response.data;
};

export const getProfile = async (token) => {
    const response = await api.get("/auth/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};