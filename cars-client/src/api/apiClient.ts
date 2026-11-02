import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        console.log(
            `[Axios] ${config.method?.toUpperCase()} ${config.url}`,
        );

        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => {
        console.log(
            `[Axios] ${response.status} ${response.config.url}`,
        );

        return response;
    },
    (error) => Promise.reject(error),
);