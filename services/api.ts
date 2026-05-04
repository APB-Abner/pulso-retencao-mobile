import axios from "axios";
import { buscarToken } from "./storageService";

const apiBaseUrlFromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
const useMockFromEnv = process.env.EXPO_PUBLIC_USE_MOCK?.trim().toLowerCase();

export const USE_MOCK = useMockFromEnv
    ? useMockFromEnv === "true"
    : !apiBaseUrlFromEnv;

export const API_BASE_URL = apiBaseUrlFromEnv || "http://localhost:3333";

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 8000,
});

api.interceptors.request.use(async (config) => {
    const token = await buscarToken();

    if (token) {
        if (typeof config.headers?.set === "function") {
            config.headers.set("Authorization", `Bearer ${token}`);
        } else {
            config.headers = config.headers ?? {};
            (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }
    }

    return config;
});
