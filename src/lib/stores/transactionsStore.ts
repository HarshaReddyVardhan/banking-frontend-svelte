import { writable } from 'svelte/store';
import type { TransactionsState } from '$lib/types';

export const transactionsStore = writable<TransactionsState>({
    byAccountId: {},
    loading: false
});
