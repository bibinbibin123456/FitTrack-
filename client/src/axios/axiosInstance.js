import axios from "axios";

const url = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

const axiosInstance = axios.create({
    baseURL: url,
    withCredentials: true,
    timeout: 10000,
});

export { axiosInstance };