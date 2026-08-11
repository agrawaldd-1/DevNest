import api from "./api.js";

export const fetchProfile = async () => {
    const response = await api.get("/profile");
    return response.data;
};

export const editProfile = async (formData) => {
    const response = await api.put("/profile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};