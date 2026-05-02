import axios from "axios";

export const USE_MOCK = false;

export const api = axios.create({
    baseURL: "http://localhost:3333",
    timeout: 8000,
});