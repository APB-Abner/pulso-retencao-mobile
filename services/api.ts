import axios from "axios";

export const USE_MOCK = true;

export const api = axios.create({
    baseURL: "http://192.168.0.10:8000",
    timeout: 8000,
});