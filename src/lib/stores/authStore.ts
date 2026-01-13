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
