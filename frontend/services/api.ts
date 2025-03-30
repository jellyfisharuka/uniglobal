import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const cookies = parseCookies();
        const token = cookies['uni_auth_token'];

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            destroyCookie(null, 'uni_auth_token', { path: '/' });

            const currentPath = window.location.pathname;
            if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register') {
                Router.push('/');
            }
        }
        return Promise.reject(error);
    }
);

export default api;