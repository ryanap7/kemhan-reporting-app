import { API_CONFIG } from "@/src/constants";
import axios from "axios";

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
