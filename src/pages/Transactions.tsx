import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';
import TransactionModal from '../components/transactions/TransactionModal';
import {
    Plus,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Edit2,
    Trash2,
    ArrowRight,
    Search,
    X,
    Calendar,
    TrendingUp
} from 'lucide-react';
import type { Account, Transaction } from '../types';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        division: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getTransactions(filters);
            setTransactions(response.data);
        } catch (error) {
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            await transactionService.deleteTransaction(id);
            toast.success('Transaction deleted', {
                icon: '🗑️',
                style: { borderRadius: '12px' },
            });
            fetchTransactions();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete transaction');
        }
    };

    const handleEdit = (transaction: Transaction) => {
        if (!transaction.isEditable) {
            toast.error('Can only edit within 12 hours of creation', {
                style: { borderRadius: '12px' },
            });
            return;
        }
        setSelectedTransaction(transaction);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedTransaction(null);
    };

    const handleSuccess = () => {
        handleModalClose();
        fetchTransactions();
    };

    const clearFilters = () => {
        setFilters({ type: '', category: '', division: '', startDate: '', endDate: '' });
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'income':
                return <ArrowUpRight className="h-4 w-4" />;
            case 'expense':
                return <ArrowDownLeft className="h-4 w-4" />;
            case 'transfer':
                return <ArrowRight className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getTransactionStyle = (type: string) => {
        switch (type) {
            case 'income':
                return {
                    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    amount: 'text-emerald-600'
                };
            case 'expense':
                return {
                    badge: 'bg-rose-100 text-rose-700 border-rose-200',
                    amount: 'text-rose-600'
                };
            case 'transfer':
                return {
                    badge: 'bg-blue-100 text-blue-700 border-blue-200',
                    amount: 'text-blue-600'
                };
            default:
                return {
                    badge: 'bg-slate-100 text-slate-700 border-slate-200',
                    amount: 'text-slate-600'
                };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                            Transactions
                        </h1>
                        <p className="text-slate-600 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Track all your financial activities
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${showFilters || hasActiveFilters
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-primary-300'
                                }`}
                        >
                            <Filter className="h-5 w-5" />
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="bg-white text-primary-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {Object.values(filters).filter(v => v !== '').length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
                            <Plus className="h-5 w-5" />
                            <span>Add</span>
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200 animate-slideDown">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Filter className="h-5 w-5 text-primary-600" />
                                Filter Transactions
                            </h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-slate-600 hover:text-rose-600 flex items-center gap-1 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    Clear all
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                            >
                                <option value="">All Types</option>
                                <option value="income">💰 Income</option>
                                <option value="expense">💸 Expense</option>
                                <option value="transfer">🔄 Transfer</option>
                            </select>

                            <select
                                value={filters.division}
                                onChange={(e) => setFilters({ ...filters, division: e.target.value })}
                                className="px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                            >
                                <option value="">All Divisions</option>
                                <option value="personal">👤 Personal</option>
                                <option value="office">💼 Office</option>
                            </select>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>

                            <button
                                onClick={() => setShowFilters(false)}
                                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}

                {/* Transactions List */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                                <p className="text-slate-600 font-medium">Loading transactions...</p>
                            </div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-4">
                                <Search className="h-10 w-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No transactions found</h3>
                            <p className="text-slate-600 mb-6">
                                {hasActiveFilters ? 'Try adjusting your filters' : 'Start by adding your first transaction'}
                            </p>
                            {!hasActiveFilters && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Add Transaction</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b-2 border-slate-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Date</th>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Description</th>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Category</th>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Division</th>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Type</th>
                                        <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm">Amount</th>
                                        <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {transactions.map((transaction: Transaction) => {
                                        const style = getTransactionStyle(transaction.type);
                                        return (
                                            <tr key={transaction._id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="py-4 px-6 text-sm text-slate-600">
                                                    {formatDateTime(transaction.date)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{transaction.description}</p>
                                                        {transaction.accountId && (
                                                            <p className="text-sm text-slate-500 mt-0.5">
                                                                {(transaction.accountId as Account).name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                                                        {transaction.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700 capitalize">
                                                        {transaction.division}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${style.badge} capitalize`}>
                                                        {getTransactionIcon(transaction.type)}
                                                        {transaction.type}
                                                    </span>
                                                </td>
                                                <td className={`py-4 px-6 text-right font-bold ${style.amount}`}>
                                                    {transaction.type === 'income' ? '+' : transaction.type === 'transfer' ? '' : '-'}
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(transaction)}
                                                            disabled={!transaction.isEditable}
                                                            className={`p-2 rounded-lg transition-all ${transaction.isEditable
                                                                ? 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                                }`}
                                                            title={transaction.isEditable ? 'Edit' : 'Can only edit within 12 hours'}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(transaction._id)}
                                                            disabled={!transaction.isEditable}
                                                            className={`p-2 rounded-lg transition-all ${transaction.isEditable
                                                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                                }`}
                                                            title={transaction.isEditable ? 'Delete' : 'Can only delete within 12 hours'}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Transaction Modal */}
                {showModal && (
                    <TransactionModal
                        transaction={selectedTransaction}
                        onClose={handleModalClose}
                        onSuccess={handleSuccess}
                    />
                )}
            </div>

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Transactions;