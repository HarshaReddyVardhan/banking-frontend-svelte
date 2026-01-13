import { api } from './api';
import { authStore } from '$lib/stores/authStore';
import { goto } from '$app/navigation'; // Only works in SvelteKit context
// Note: goto might not work in service if called outside component initialization in SSR, 
// but for client side interactions it is fine.
// Actually, strict service layer shouldn't depend on $app/navigation directly if possible, 
// but it's convenient. I'll simply return data and let caller handle navigation.

import type { User } from '$lib/types';

interface LoginResponse {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    user?: User;
    mfaRequired?: boolean;
    mfaToken?: string;
}

export const authService = {
    async login(username: string, password: string): Promise<LoginResponse> {
        const data = await api.post<LoginResponse>('/auth/login', { username, password }, { requiresAuth: false });

        if (data.mfaRequired) {
            authStore.update(s => ({ ...s, mfaRequired: true, mfaToken: data.mfaToken }));
        } else if (data.accessToken && data.user) {
            authStore.set({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken || null,
                expiresAt: Date.now() + (data.expiresIn || 900) * 1000,
                mfaRequired: false,
                mfaToken: null
            });
        }
        return data;
    },

    async verifyMfa(mfaToken: string, code: string): Promise<LoginResponse> {
        const data = await api.post<LoginResponse>('/auth/mfa/verify', { mfaToken, code }, { requiresAuth: false });

        if (data.accessToken && data.user) {
            authStore.set({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken || null,
                expiresAt: Date.now() + (data.expiresIn || 900) * 1000,
                mfaRequired: false,
                mfaToken: null
            });
        }
        return data;
    },

    async logout() {
        try {
            await api.post('/auth/logout', {});
        } catch (e) {
            console.error('Logout failed', e);
        }
        authStore.set({
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            mfaRequired: false
        });
    }
};
