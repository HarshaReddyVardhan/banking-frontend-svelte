import { get } from 'svelte/store';
import { authStore } from '$lib/stores/authStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bank.example.com';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');

    if (requiresAuth) {
        const { accessToken } = get(authStore);
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
    }

    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...fetchOptions,
        headers
    });

    if (!response.ok) {
        if (response.status === 401 && requiresAuth) {
            // Handle token expiration/refresh logic here or redirect to login
            // For now, simple error throw
        }
        const errorBody = await response.text();
        throw new Error(errorBody || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, body: any, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: any, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'DELETE' })
};
