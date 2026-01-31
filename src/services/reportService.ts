import api from './api';

export const reportService = {
    getDashboardSummary: async (params: any) => {
        const response = await api.get('/reports/dashboard', { params });
        return response.data;
    },

    getTrend: async (params: any) => {
        const response = await api.get('/reports/trend', { params });
        return response.data;
    },

    getCategoryBreakdown: async (params: any) => {
        const response = await api.get('/reports/category-breakdown', { params });
        return response.data;
    },

    getDivisionBreakdown: async (params: any) => {
        const response = await api.get('/reports/division-breakdown', { params });
        return response.data;
    }
};