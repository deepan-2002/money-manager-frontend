import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Wallet, CreditCard, Building2, PiggyBank, Edit2, Trash2 } from 'lucide-react';
import type { Account, CreateAccountDto } from '../types';
import { formatCurrency } from '../utils/helpers';
import { accountService } from '../services/accountService';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<CreateAccountDto>({
        name: '',
        type: 'cash',
        balance: 0,
        currency: 'INR'
    });
    const [editingId, setEditingId] = useState<string | null>(null);

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
            if (editingId) {
                await accountService.updateAccount(editingId, formData);
                toast.success('Account updated successfully');
            } else {
                await accountService.createAccount(formData);
                toast.success('Account created successfully');
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: '', type: 'cash', balance: 0, currency: 'INR' });
            fetchAccounts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (account: Account) => {
        setFormData({
            name: account.name,
            type: account.type,
            balance: account.balance,
            currency: account.currency
        });
        setEditingId(account._id);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this account?')) {
            return;
        }

        try {
            await accountService.deleteAccount(id);
            toast.success('Account deleted successfully');
            fetchAccounts();
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    const getAccountIcon = (type: string) => {
        switch (type) {
            case 'cash':
                return <Wallet className="h-8 w-8" />;
            case 'bank':
                return <Building2 className="h-8 w-8" />;
            case 'credit_card':
                return <CreditCard className="h-8 w-8" />;
            case 'savings':
                return <PiggyBank className="h-8 w-8" />;
            default:
                return <Wallet className="h-8 w-8" />;
        }
    };

    const getAccountColor = (type: string) => {
        switch (type) {
            case 'cash':
                return 'bg-green-100 text-green-600';
            case 'bank':
                return 'bg-blue-100 text-blue-600';
            case 'credit_card':
                return 'bg-purple-100 text-purple-600';
            case 'savings':
                return 'bg-yellow-100 text-yellow-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const totalBalance = accounts.reduce((sum: number, acc: Account) => sum + acc.balance, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
                    <p className="text-gray-600 mt-1">Manage your financial accounts</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', type: 'cash', balance: 0, currency: 'INR' });
                        setShowModal(true);
                    }}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Account</span>
                </button>
            </div>

            {/* Total Balance Card */}
            <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-8">
                <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
                <p className="text-4xl font-bold">{formatCurrency(totalBalance)}</p>
                <p className="text-primary-100 mt-2">Across {accounts.length} accounts</p>
            </div>

            {/* Accounts Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            ) : accounts.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No accounts yet. Create your first account to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account: Account) => (
                        <div key={account._id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${getAccountColor(account.type)}`}>
                                    {getAccountIcon(account.type)}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(account)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(account._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{account.name}</h3>
                            <p className="text-sm text-gray-500 capitalize mb-4">{account.type.replace('_', ' ')}</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.balance)}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Account Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? 'Edit Account' : 'Add Account'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g., My Wallet, Bank Account"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Type *
                                </label>
                                <select
                                    required
                                    className="input-field"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Account</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="savings">Savings</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Initial Balance
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input-field"
                                    placeholder="0.00"
                                    value={formData.balance}
                                    onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingId(null);
                                    }}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 btn-primary">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;