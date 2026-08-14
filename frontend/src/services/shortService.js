import api from "./api.js";

export const createShort = async (
    formData
) => {
    const response = await api.post(
        "/shorts/create",
        formData
    );

    return response.data;
};

export const getAllShorts = async () => {
    const response = await api.get(
        "/shorts"
    );

    return response.data;
};

export const viewShort = async (
    shortId
) => {
    const response = await api.get(
        `/shorts/${shortId}`
    );

    return response.data;
};

export const editShort = async (
    shortId,
    caption
) => {
    const response = await api.put(
        `/shorts/edit/${shortId}`,
        {
            caption,
        }
    );

    return response.data;
};

export const deleteShort = async (
    shortId
) => {
    const response = await api.delete(
        `/shorts/delete/${shortId}`
    );

    return response.data;
};