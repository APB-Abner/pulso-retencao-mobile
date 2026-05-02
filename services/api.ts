import axios from "axios";

export const USE_MOCK = false;

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || "http://localhost:3333";

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 8000,
});
