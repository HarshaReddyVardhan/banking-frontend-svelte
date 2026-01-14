import { get } from 'svelte/store';
import { z } from 'zod';
import { authStore } from '$lib/stores/authStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bank.example.com';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
    schema?: z.ZodSchema;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, schema, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');

    if (requiresAuth) {
        const { accessToken } = get(authStore);
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
    }

    const url = `${BASE_URL}${endpoint}`;

    // Default timeout 10s
    const { timeout = 10000 } = fetchOptions as any;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            signal: controller.signal
        });
        clearTimeout(id);

        if (!response.ok) {
            if (response.status === 401 && requiresAuth) {
                // Trigger logout or refresh
                authStore.set({ user: null, accessToken: null, refreshToken: null, expiresAt: null, mfaRequired: false, mfaToken: null });
            }
            const errorBody = await response.text();
            throw new Error(errorBody || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    } catch (error) {
        // Handle network errors
        console.error('API Request failed:', error);
        throw error;
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, body: any, options?: RequestOptions) => {
        if (options?.schema) {
            try {
                options.schema.parse(body);
            } catch (e) {
                console.error('Validation failed', e);
                // Re-throw or return a specific validation error structure
                throw e;
            }
        }
        return request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
    },
    put: <T>(endpoint: string, body: any, options?: RequestOptions) => {
        if (options?.schema) {
            options.schema.parse(body);
        }
        return request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
    },
    delete: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'DELETE' })
};
