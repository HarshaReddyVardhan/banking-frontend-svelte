import { api } from './api';
import { accountsStore } from '$lib/stores/accountsStore';
import { transactionsStore } from '$lib/stores/transactionsStore';
import type { Account, TransactionListResponse } from '$lib/types';

export const accountsService = {
    async fetchAccounts() {
        accountsStore.update(s => ({ ...s, loading: true, error: null }));
        try {
            const accounts = await api.get<Account[]>('/accounts');
            accountsStore.update(s => ({ ...s, accounts, loading: false }));
            return accounts;
        } catch (e: any) {
            accountsStore.update(s => ({ ...s, loading: false, error: e.message }));
            throw e;
        }
    },

    async fetchAccountDetails(id: string) {
        // This might update a specific account or the main list (if we want to cache)
        // For now just return
        return api.get<Account>(`/accounts/${id}`);
    },

    async fetchTransactions(accountId: string, cursor?: string, limit = 50) {
        transactionsStore.update(s => ({ ...s, loading: true }));
        try {
            const query = new URLSearchParams({ limit: limit.toString() });
            if (cursor) query.append('cursor', cursor);

            const response = await api.get<TransactionListResponse>(`/accounts/${accountId}/transactions?${query.toString()}`);

            transactionsStore.update(s => ({
                ...s,
                loading: false,
                byAccountId: {
                    ...s.byAccountId,
                    [accountId]: cursor
                        ? [...(s.byAccountId[accountId] || []), ...response.items] // Append if paging
                        : response.items // Replace if fresh fetch
                }
            }));
            return response;
        } catch (e) {
            transactionsStore.update(s => ({ ...s, loading: false }));
            throw e;
        }
    }
};
