import axios from "axios";

const url = "http://localhost:4000/api/v1";

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
  timeout: 10000,
});

export { axiosInstance };