import axios from "axios";

const url = import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: url || "http://localhost:4000/api/v1",
    withCredentials: true,
    timeout: 10000,
});

export { axiosInstance };