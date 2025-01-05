import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
