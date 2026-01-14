import { get } from 'svelte/store';
import { authStore } from '$lib/stores/authStore';
import { websocketStore } from '$lib/stores/websocketStore';
import { accountsStore } from '$lib/stores/accountsStore';
import { transactionsStore } from '$lib/stores/transactionsStore';
import { notificationsStore } from '$lib/stores/notificationsStore';

interface WebSocketEvent {
    eventType: 'TransactionCompleted' | 'TransactionPending' | 'FraudAlert' | 'BalanceUpdated' | 'SessionRevoked';
    timestamp: string;
    data: any;
}

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://ws.bank.example.com';
let socket: WebSocket | null = null;
let reconnectTimer: any = null;

export const websocketService = {
    connect() {
        const { accessToken } = get(authStore);
        if (!accessToken) return;

        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return;

        const url = `${WS_BASE_URL}?token=${accessToken}`;
        socket = new WebSocket(url);

        socket.onopen = () => {
            websocketStore.update(s => ({ ...s, connected: true }));
            console.log('WS connected');
        };

        socket.onclose = () => {
            websocketStore.update(s => ({ ...s, connected: false }));
            console.log('WS disconnected');
            // Reconnect logic
            clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(() => websocketService.connect(), 5000); // 5s backoff
        };

        socket.onerror = (e) => {
            console.error('WS error', e);
        };

        socket.onmessage = (event) => {
            try {
                const payload: WebSocketEvent = JSON.parse(event.data);
                handleEvent(payload);
            } catch (e) {
                console.error('WS parse error', e);
            }
        };
    },

    disconnect() {
        if (socket) {
            socket.close();
            socket = null;
        }
    }
};

function handleEvent(event: WebSocketEvent) {
    const { eventType, data } = event;

    if (eventType === 'BalanceUpdated' || eventType === 'TransactionCompleted') {
        // Update accounts if balance is present
        if (data.balanceAfter !== undefined && data.fromAccountId) {
            accountsStore.update(s => ({
                ...s,
                accounts: s.accounts.map(a => a.id === data.fromAccountId ? { ...a, balance: data.balanceAfter, availableBalance: data.balanceAfter } : a)
            }));
        }
    }

    if (eventType === 'TransactionCompleted' || eventType === 'TransactionPending') {
        // Add to transactions
        const { fromAccountId, transactionId, amount, currency, description, date } = data;

        if (fromAccountId) {
            const newTransaction = {
                id: transactionId,
                accountId: fromAccountId,
                date: date || new Date().toISOString(),
                amount: amount,
                currency: currency,
                description: description || 'New Transaction',
                status: eventType === 'TransactionCompleted' ? 'COMPLETED' : 'PENDING'
            };

            transactionsStore.addTransaction(newTransaction);
        }
    }

    // Always notify
    notificationsStore.update(s => ({
        ...s,
        unreadCount: s.unreadCount + 1,
        items: [
            {
                id: `evt-${Date.now()}`,
                type: eventType as any,
                createdAt: new Date().toISOString(),
                payload: data,
                read: false
            },
            ...s.items
        ]
    }));
}
