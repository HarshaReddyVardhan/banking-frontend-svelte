import { describe, it, expect, vi, beforeEach } from 'vitest';
import { websocketService } from './websocketService';
import { transactionsStore } from '$lib/stores/transactionsStore';
import { get } from 'svelte/store';

// Mock svelte/store
vi.mock('svelte/store', async () => {
    const actual = await vi.importActual('svelte/store');
    return {
        ...actual as any,
        get: vi.fn()
    };
});

// Mock stores
// Mock stores
vi.mock('$lib/stores/authStore', () => ({
    authStore: {
        subscribe: vi.fn((run) => {
            run({ accessToken: 'valid-token' }); // Immediate update for get() if used without mock
            return () => { };
        }),
        set: vi.fn()
    }
}));

vi.mock('$lib/stores/websocketStore', () => ({
    websocketStore: {
        update: vi.fn()
    }
}));

vi.mock('$lib/stores/accountsStore', () => ({
    accountsStore: {
        update: vi.fn()
    }
}));

vi.mock('$lib/stores/notificationsStore', () => ({
    notificationsStore: {
        update: vi.fn()
    }
}));

// Mock transactionsStore
const addTransactionMock = vi.fn();
vi.mock('$lib/stores/transactionsStore', () => ({
    transactionsStore: {
        addTransaction: (tx: any) => addTransactionMock(tx)
    }
}));


describe('WebSocket Service Integration', () => {
    let mockSocket: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockSocket = {
            send: vi.fn(),
            close: vi.fn(),
            readyState: WebSocket.OPEN
        };
        vi.stubGlobal('WebSocket', vi.fn(() => mockSocket));
        (get as any).mockReturnValue({ accessToken: 'valid-token' });
    });

    it('processes TransactionCompleted event and updates store', () => {
        websocketService.connect();

        // Simulate message
        const eventData = {
            eventType: 'TransactionCompleted',
            timestamp: new Date().toISOString(),
            data: {
                fromAccountId: 'acc-123',
                transactionId: 'tx-999',
                amount: -50.00,
                currency: 'USD',
                description: 'Grocery Store'
            }
        };

        mockSocket.onmessage({ data: JSON.stringify(eventData) });

        expect(addTransactionMock).toHaveBeenCalledWith(expect.objectContaining({
            id: 'tx-999',
            accountId: 'acc-123',
            amount: -50.00,
            status: 'COMPLETED'
        }));
    });
});
