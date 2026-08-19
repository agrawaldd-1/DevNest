import api from "./api.js";

export const searchBar = async (query) => {
    const response = await api.get("/search", {params: {query,},});

    return response.data;
};