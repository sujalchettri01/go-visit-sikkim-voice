import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // ✅ sends cookies automatically on every request
});

export default api;