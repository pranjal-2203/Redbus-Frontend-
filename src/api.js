import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export const searchCities = async (search) => {
    const response = await api.get(`/cities?search=${encodeURIComponent(search)}`);
    return response.data;
};

export default api;