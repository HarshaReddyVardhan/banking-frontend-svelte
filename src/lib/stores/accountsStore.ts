import { writable } from 'svelte/store';
import type { AccountsState } from '$lib/types';

export const accountsStore = writable<AccountsState>({
    accounts: [],
    loading: false,
    error: null
});
