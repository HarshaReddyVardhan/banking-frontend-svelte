import { writable } from 'svelte/store';
import type { AuthState } from '$lib/types';

export const authStore = writable<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    mfaRequired: false,
    mfaToken: null
});

export const resetAuth = () => {
    authStore.set({
        user: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        mfaRequired: false,
        mfaToken: null
    });
    // Explicitly clear any side-effects if we had them (like localStorage for non-sensitive data)
};
