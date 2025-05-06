import axios, {AxiosInstance, InternalAxiosRequestConfig} from "axios";
import Cookie from "js-cookie";

const backendLocation: string = import.meta.env.VITE_BACKEND_LOCATION;

const api: AxiosInstance = axios.create({
    baseURL: backendLocation,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token: string | undefined = Cookie.get("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: unknown): Promise<never> => {
        return Promise.reject(error);
    }
);

export default api;
