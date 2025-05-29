import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const instance = axios.create({ baseURL: BASE_URL });

instance.interceptors.request.use((request) => {
  const token = localStorage.getItem("token")
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  //for ngrok only
  request.headers["ngrok-skip-browser-warning"] = "69420";

  return request;
})

instance.interceptors.response.use((response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
  }
  return response;
})