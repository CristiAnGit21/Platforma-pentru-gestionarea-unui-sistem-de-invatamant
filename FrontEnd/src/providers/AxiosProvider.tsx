import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import axios, { AxiosError, type AxiosInstance } from "axios";
import { clearAuthSession, getAuthSession } from "../auth/storage";

const API_BASE_URL = "http://localhost:5298/api";

const AxiosContext = createContext<AxiosInstance | null>(null);

function getTokenFromStorage(): string | null {
    const directToken = localStorage.getItem("token");
    if (directToken) return directToken;

    const session = getAuthSession();
    return session?.token ?? null;
}

function buildApiClient(): AxiosInstance {
    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    api.interceptors.request.use((config) => {
        const token = getTokenFromStorage();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                clearAuthSession();
                window.location.replace("/login");
            }

            return Promise.reject(error);
        }
    );

    return api;
}

export function AxiosProvider({ children }: { children: ReactNode }) {
    const apiRef = useRef<AxiosInstance | null>(null);

    if (!apiRef.current) {
        apiRef.current = buildApiClient();
    }

    useEffect(() => {
        return () => {
            apiRef.current = null;
        };
    }, []);

    return <AxiosContext.Provider value={apiRef.current}>{children}</AxiosContext.Provider>;
}

export function useApi(): AxiosInstance {
    const context = useContext(AxiosContext);
    if (!context) {
        throw new Error("useApi must be used inside AxiosProvider");
    }

    return context;
}
