import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    config.headers['x-api-token'] = process.env.NEXT_PUBLIC_API_TOKEN;
    return config;
});

export default api;
