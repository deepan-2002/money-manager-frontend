import type { CreateTransactionDto, UpdateTransactionDto } from '../types';
import api from './api';

export const transactionService = {
    getTransactions: async (params: any) => {
        const response = await api.get('/transactions', { params });
        return response.data;
    },

    getTransaction: async (id: string) => {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    },

    createTransaction: async (data: CreateTransactionDto) => {
        const response = await api.post('/transactions', data);
        return response.data;
    },

    updateTransaction: async (id: string, data: UpdateTransactionDto) => {
        const response = await api.put(`/transactions/${id}`, data);
        return response.data;
    },

    deleteTransaction: async (id: string) => {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    },

    getCategorySummary: async (params: any) => {
        const response = await api.get('/transactions/summary/category', { params });
        return response.data;
    }
};