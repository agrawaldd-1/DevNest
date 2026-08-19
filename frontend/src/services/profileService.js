import api from "./api.js";

export const fetchProfile = async (userId = null) => {
    const response = await api.get(userId ? `/profile/${userId}` : "/profile");
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