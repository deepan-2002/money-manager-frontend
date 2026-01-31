import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import { accountService } from '../../services/accountService';
import toast from 'react-hot-toast';
import { X, DollarSign, Wallet, Calendar } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, DIVISIONS } from '../../utils/constants';
import type { Account } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
    transaction?: any;
}

const TransactionModal: React.FC<Props> = ({ onClose, onSuccess, transaction = null }) => {
    const [activeTab, setActiveTab] = useState(transaction?.type || 'expense');
    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({
        accountId: transaction?.accountId?._id || '',
        amount: transaction?.amount || '',
        category: transaction?.category || '',
        division: transaction?.division || 'personal',
        description: transaction?.description || '',
        date: transaction?.date ? new Date(transaction.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        toAccountId: transaction?.toAccountId?._id || ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await accountService.getAccounts();
            setAccounts(response.data);
            if (response.data.length > 0 && !formData.accountId) {
                setFormData(prev => ({ ...prev, accountId: response.data[0]._id }));
            }
        } catch (error) {
            toast.error('Failed to load accounts');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                ...formData,
                type: activeTab,
                amount: parseFloat(formData.amount)
            };

            if (transaction) {
                await transactionService.updateTransaction(transaction._id, data);
                toast.success('Transaction updated!', {
                    icon: '✓',
                    style: { borderRadius: '12px' },
                });
            } else {
                await transactionService.createTransaction(data);
                toast.success('Transaction added!', {
                    icon: '🎉',
                    style: { borderRadius: '12px' },
                });
            }

            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed', {
                style: { borderRadius: '12px' },
            });
        } finally {
            setLoading(false);
        }
    };

    const categories = activeTab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const tabConfig = {
        expense: {
            color: 'rose',
            gradient: 'from-rose-500 to-rose-600',
            bg: 'bg-rose-50',
            text: 'text-rose-600',
            border: 'border-rose-600'
        },
        income: {
            color: 'emerald',
            gradient: 'from-emerald-500 to-emerald-600',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            border: 'border-emerald-600'
        },
        transfer: {
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-600'
        }
    };

    const currentTab = tabConfig[activeTab as keyof typeof tabConfig];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 rounded-t-3xl z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                {transaction ? 'Edit Transaction' : 'New Transaction'}
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                {transaction ? 'Update transaction details' : 'Add a new financial transaction'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                {!transaction && (
                    <div className="flex gap-2 p-4 bg-slate-50 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('expense')}
                            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all ${activeTab === 'expense'
                                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            💸 Expense
                        </button>
                        <button
                            onClick={() => setActiveTab('income')}
                            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all ${activeTab === 'income'
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            💰 Income
                        </button>
                        <button
                            onClick={() => setActiveTab('transfer')}
                            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all ${activeTab === 'transfer'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            🔄 Transfer
                        </button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Amount *
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <DollarSign className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                name="amount"
                                required
                                step="0.01"
                                min="0"
                                className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Account */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            {activeTab === 'transfer' ? 'From Account *' : 'Account *'}
                        </label>
                        <select
                            name="accountId"
                            required
                            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white font-medium"
                            value={formData.accountId}
                            onChange={handleChange}
                        >
                            <option value="">Select account</option>
                            {accounts.map((account: Account) => (
                                <option key={account._id} value={account._id}>
                                    {account.name} • {formatCurrency(account.balance)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* To Account (for transfers) */}
                    {activeTab === 'transfer' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                To Account *
                            </label>
                            <select
                                name="toAccountId"
                                required
                                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white font-medium"
                                value={formData.toAccountId}
                                onChange={handleChange}
                            >
                                <option value="">Select account</option>
                                {accounts
                                    .filter((acc: Account) => acc._id !== formData.accountId)
                                    .map((account: Account) => (
                                        <option key={account._id} value={account._id}>
                                            {account.name} • {formatCurrency(account.balance)}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {/* Category */}
                    {activeTab !== 'transfer' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Category *
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.value })}
                                        className={`group p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${formData.category === cat.value
                                                ? `border-2 ${currentTab.border} ${currentTab.bg} shadow-lg`
                                                : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                                            {cat.icon}
                                        </div>
                                        <div className={`text-xs font-semibold ${formData.category === cat.value ? currentTab.text : 'text-slate-600'
                                            }`}>
                                            {cat.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Division */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Division *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, division: DIVISIONS.PERSONAL })}
                                className={`group p-5 rounded-xl border-2 transition-all transform hover:scale-105 ${formData.division === DIVISIONS.PERSONAL
                                        ? 'border-primary-600 bg-primary-50 shadow-lg'
                                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                                    }`}
                            >
                                <div className="text-2xl mb-2">👤</div>
                                <div className={`font-bold ${formData.division === DIVISIONS.PERSONAL ? 'text-primary-700' : 'text-slate-700'
                                    }`}>
                                    Personal
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, division: DIVISIONS.OFFICE })}
                                className={`group p-5 rounded-xl border-2 transition-all transform hover:scale-105 ${formData.division === DIVISIONS.OFFICE
                                        ? 'border-primary-600 bg-primary-50 shadow-lg'
                                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                                    }`}
                            >
                                <div className="text-2xl mb-2">💼</div>
                                <div className={`font-bold ${formData.division === DIVISIONS.OFFICE ? 'text-primary-700' : 'text-slate-700'
                                    }`}>
                                    Office
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description *
                        </label>
                        <input
                            type="text"
                            name="description"
                            required
                            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                            placeholder="What was this for?"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            name="date"
                            required
                            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-6 py-4 bg-gradient-to-r ${currentTab.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Saving...
                                </span>
                            ) : (
                                transaction ? 'Update Transaction' : 'Add Transaction'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default TransactionModal;