import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Change this if your Laravel backend URL is different

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
