import { writable } from 'svelte/store';
import type { TransactionsState } from '$lib/types';

function createTransactionsStore() {
    const { subscribe, set, update } = writable<TransactionsState>({
        byAccountId: {},
        loading: false
    });

    return {
        subscribe,
        set,
        update,
        addTransaction: (transaction: any) => update(state => {
            const accountId = transaction.accountId;
            if (!accountId) return state;

            const currentList = state.byAccountId[accountId] || [];
            // Prepend new transaction
            return {
                ...state,
                byAccountId: {
                    ...state.byAccountId,
                    [accountId]: [transaction, ...currentList]
                }
            };
        })
    };
}

export const transactionsStore = createTransactionsStore();
