import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Wallet, CreditCard, Building2, PiggyBank, Edit2, Trash2, TrendingUp } from 'lucide-react';
import type { Account, CreateAccountDto } from '../types';
import { formatCurrency } from '../utils/helpers';
import { accountService } from '../services/accountService';
import { useNavigate } from 'react-router-dom';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
        type: 'cash',
        balance: '0',
        currency: 'INR'
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await accountService.getAccounts();
            setAccounts(response.data);
        } catch (error) {
            toast.error('Failed to load accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                balance: parseFloat(formData.balance.toString()) || 0
            };

            if (editingId) {
                await accountService.updateAccount(editingId, payload);
                toast.success('Account updated successfully', {
                    icon: '✓',
                    style: { borderRadius: '12px' },
                });
            } else {
                await accountService.createAccount(payload);
                toast.success('Account created successfully', {
                    icon: '🎉',
                    style: { borderRadius: '12px' },
                });
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: '', type: 'cash', balance: '0', currency: 'INR' });
            fetchAccounts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed', {
                style: { borderRadius: '12px' },
            });
        }
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>, account: Account) => {
        e.stopPropagation();
        setFormData({
            name: account.name,
            type: account.type,
            balance: account.balance.toString(),
            currency: account.currency
        });
        setEditingId(account._id);
        setShowModal(true);
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this account?')) {
            return;
        }

        try {
            await accountService.deleteAccount(id);
            toast.success('Account deleted successfully', {
                icon: '🗑️',
                style: { borderRadius: '12px' },
            });
            fetchAccounts();
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    const getAccountIcon = (type: string) => {
        switch (type) {
            case 'cash':
                return <Wallet className="h-7 w-7" />;
            case 'bank':
                return <Building2 className="h-7 w-7" />;
            case 'credit_card':
                return <CreditCard className="h-7 w-7" />;
            case 'savings':
                return <PiggyBank className="h-7 w-7" />;
            default:
                return <Wallet className="h-7 w-7" />;
        }
    };

    const getAccountGradient = (type: string) => {
        switch (type) {
            case 'cash':
                return 'from-emerald-500 to-emerald-600';
            case 'bank':
                return 'from-blue-500 to-blue-600';
            case 'credit_card':
                return 'from-purple-500 to-purple-600';
            case 'savings':
                return 'from-amber-500 to-amber-600';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    const getAccountBgColor = (type: string) => {
        switch (type) {
            case 'cash':
                return 'bg-emerald-50 border-emerald-200';
            case 'bank':
                return 'bg-blue-50 border-blue-200';
            case 'credit_card':
                return 'bg-purple-50 border-purple-200';
            case 'savings':
                return 'bg-amber-50 border-amber-200';
            default:
                return 'bg-slate-50 border-slate-200';
        }
    };

    const totalBalance = accounts.reduce((sum: number, acc: Account) => sum + acc.balance, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                            My Accounts
                        </h1>
                        <p className="text-slate-600 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Manage your financial accounts
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ name: '', type: 'cash', balance: '0', currency: 'INR' });
                            setShowModal(true);
                        }}
                        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
                        <Plus className="h-5 w-5" />
                        <span>Add Account</span>
                    </button>
                </div>

                {/* Total Balance Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl mb-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                    <div className="relative p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-200 text-sm font-medium mb-2">Total Balance</p>
                                <h2 className="text-5xl font-bold text-white mb-4">{formatCurrency(totalBalance)}</h2>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <Wallet className="h-5 w-5 text-white" />
                                    <p className="text-white font-medium">{accounts.length} Active Accounts</p>
                                </div>
                            </div>
                            <div className="hidden sm:block p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <TrendingUp className="h-16 w-16 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accounts Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                            <p className="text-slate-600 font-medium">Loading accounts...</p>
                        </div>
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-4">
                            <Wallet className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No accounts yet</h3>
                        <p className="text-slate-600 mb-6">Create your first account to start managing your finances</p>
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ name: '', type: 'cash', balance: '0', currency: 'INR' });
                                setShowModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Create Account</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map((account: Account) => (
                            <div
                                key={account._id}
                                className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${getAccountBgColor(account.type)}`}
                                onClick={() => navigate(`/accounts/${account._id}`)}
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-3 bg-gradient-to-br ${getAccountGradient(account.type)} rounded-xl shadow-md`}>
                                            <div className="text-white">
                                                {getAccountIcon(account.type)}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleEdit(e, account)}
                                                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, account._id)}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Account Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{account.name}</h3>
                                        <p className="text-sm text-slate-500 capitalize mb-4">
                                            {account.type.replace('_', ' ')}
                                        </p>
                                        <div className="pt-4 border-t border-slate-200">
                                            <p className="text-2xl font-bold text-slate-900">
                                                {formatCurrency(account.balance)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Account Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform animate-slideUp">
                            <div className="p-6 border-b border-slate-200">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {editingId ? 'Edit Account' : 'Create New Account'}
                                </h2>
                                <p className="text-slate-600 mt-1">
                                    {editingId ? 'Update account details' : 'Add a new financial account'}
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Account Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                        placeholder="e.g., My Wallet, Savings Account"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Account Type *
                                    </label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="cash">💵 Cash</option>
                                        <option value="bank">🏦 Bank Account</option>
                                        <option value="credit_card">💳 Credit Card</option>
                                        <option value="savings">🐷 Savings</option>
                                    </select>
                                </div>

                                {!editingId && <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Initial Balance
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                            ₹
                                        </span>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="0.00"
                                            value={formData.balance}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Allow only numbers and leading minus sign
                                                if (val === '' || val === '-' || /^-?\d*\.?\d*$/.test(val)) {
                                                    setFormData({ ...formData, balance: val });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingId(null);
                                        }}
                                        className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        {editingId ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
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

export default Accounts;