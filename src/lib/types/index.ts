export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null; // Timestamp
    mfaRequired: boolean;
    mfaToken?: string | null;
}

export interface Account {
    id: string;
    type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'LOAN'; // Add other types as needed
    name: string;
    currency: string;
    balance: number;
    availableBalance: number;
}

export interface AccountsState {
    accounts: Account[];
    loading: boolean;
    error?: string | null;
}

export interface Transaction {
    id: string;
    date: string; // ISO date string
    amount: number;
    currency: string;
    description: string;
    status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'FAILED';
}

export interface TransactionListResponse {
    items: Transaction[];
    nextCursor?: string;
}

export interface TransactionsState {
    byAccountId: Record<string, Transaction[]>;
    loading: boolean;
}

export interface NotificationItem {
    id: string;
    type: 'TRANSACTION_COMPLETED' | 'TRANSACTION_PENDING' | 'FRAUD_ALERT' | 'BALANCE_UPDATED' | 'SESSION_REVOKED';
    createdAt: string;
    payload: any;
    read: boolean;
}

export interface NotificationsState {
    items: NotificationItem[];
    unreadCount: number;
}

export interface WebSocketState {
    connected: boolean;
    lastPing: number | null;
}
