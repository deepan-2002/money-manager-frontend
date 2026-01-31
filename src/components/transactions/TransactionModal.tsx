import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import { accountService } from '../../services/accountService';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
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
                toast.success('Transaction updated successfully');
            } else {
                await transactionService.createTransaction(data);
                toast.success('Transaction created successfully');
            }

            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const categories = activeTab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {transaction ? 'Edit Transaction' : 'Add Transaction'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tabs */}
                {!transaction && (
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('expense')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'expense'
                                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Expense
                        </button>
                        <button
                            onClick={() => setActiveTab('income')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'income'
                                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Income
                        </button>
                        <button
                            onClick={() => setActiveTab('transfer')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'transfer'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Transfer
                        </button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount *
                        </label>
                        <input
                            type="number"
                            name="amount"
                            required
                            step="0.01"
                            min="0"
                            className="input-field text-lg"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Account */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {activeTab === 'transfer' ? 'From Account *' : 'Account *'}
                        </label>
                        <select
                            name="accountId"
                            required
                            className="input-field"
                            value={formData.accountId}
                            onChange={handleChange}
                        >
                            <option value="">Select account</option>
                            {accounts.map((account: Account) => (
                                <option key={account._id} value={account._id}>
                                    {account.name} ({formatCurrency(account.balance)})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* To Account (for transfers) */}
                    {activeTab === 'transfer' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                To Account *
                            </label>
                            <select
                                name="toAccountId"
                                required
                                className="input-field"
                                value={formData.toAccountId}
                                onChange={handleChange}
                            >
                                <option value="">Select account</option>
                                {accounts
                                    .filter((acc: Account) => acc._id !== formData.accountId)
                                    .map((account: Account) => (
                                        <option key={account._id} value={account._id}>
                                            {account.name} ({formatCurrency(account.balance)})
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {/* Category */}
                    {activeTab !== 'transfer' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.value })}
                                        className={`p-3 rounded-lg border-2 transition-all ${formData.category === cat.value
                                                ? 'border-primary-600 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{cat.icon}</div>
                                        <div className="text-xs font-medium">{cat.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Division */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Division *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, division: DIVISIONS.PERSONAL })}
                                className={`p-4 rounded-lg border-2 transition-all ${formData.division === DIVISIONS.PERSONAL
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-lg font-medium">Personal</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, division: DIVISIONS.OFFICE })}
                                className={`p-4 rounded-lg border-2 transition-all ${formData.division === DIVISIONS.OFFICE
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-lg font-medium">Office</div>
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <input
                            type="text"
                            name="description"
                            required
                            className="input-field"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            name="date"
                            required
                            className="input-field"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : transaction ? 'Update' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;