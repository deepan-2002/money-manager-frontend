import type { Account, CreateAccountDto, UpdateAccountDto } from '../types';
import api from './api';

export const accountService = {
    getAccounts: async () => {
        const response = await api.get('/accounts');
        return response.data;
    },

    getAccount: async (id: string) => {
        const response = await api.get(`/accounts/${id}`);
        return response.data;
    },

    createAccount: async (data: CreateAccountDto) => {
        const response = await api.post('/accounts', data);
        return response.data;
    },

    updateAccount: async (id: string, data: UpdateAccountDto) => {
        const response = await api.put(`/accounts/${id}`, data);
        return response.data;
    },

    deleteAccount: async (id: string) => {
        const response = await api.delete(`/accounts/${id}`);
        return response.data;
    }
};