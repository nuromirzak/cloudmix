import axios from "axios";
import {useAuthStore} from "../store/authStore.ts";

function getBaseUrl(): string {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    if (!BASE_URL || typeof BASE_URL !== "string" || BASE_URL.trim() === "") {
        throw new Error("API base URL is not set or is invalid");
    }

    return BASE_URL;
}

export const api = axios.create({
    baseURL: getBaseUrl(),
});

api.interceptors.request.use((config) => {
    const username = useAuthStore.getState().user?.username;
    const password = useAuthStore.getState().user?.password;

    if (username && password) {
        config.auth = {
            username,
            password,
        };
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});
