import { api } from './api';

export interface TransferQuoteRequest {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    currency: string;
}

export interface TransferQuoteResponse {
    fee: number;
    rate: number;
    estimatedDelivery: string;
}

export interface TransferRequest {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    currency: string;
    memo?: string;
    clientReference?: string;
}

export interface TransferResponse {
    transactionId: string;
    status: string;
    createdAt: string;
}

export const transfersService = {
    async getQuote(req: TransferQuoteRequest): Promise<TransferQuoteResponse> {
        return api.post<TransferQuoteResponse>('/transfers/quote', req);
    },

    async createTransfer(req: TransferRequest): Promise<TransferResponse> {
        return api.post<TransferResponse>('/transfers', req);
    }
};
