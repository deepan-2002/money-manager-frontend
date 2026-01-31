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
    ArrowRight
} from 'lucide-react';
import type { Account, Transaction } from '../types';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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
            toast.success('Transaction deleted successfully');
            fetchTransactions();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete transaction');
        }
    };

    const handleEdit = (transaction: Transaction) => {
        if (!transaction.isEditable) {
            toast.error('Transaction can only be edited within 12 hours of creation');
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

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'income':
                return <ArrowUpRight className="h-5 w-5 text-green-600" />;
            case 'expense':
                return <ArrowDownLeft className="h-5 w-5 text-red-600" />;
            case 'transfer':
                return <ArrowRight className="h-5 w-5 text-blue-600" />;
            default:
                return null;
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'income':
                return 'text-green-600 bg-green-50';
            case 'expense':
                return 'text-red-600 bg-red-50';
            case 'transfer':
                return 'text-blue-600 bg-blue-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-600 mt-1">Manage all your financial transactions</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold">Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="input-field"
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                        <option value="transfer">Transfer</option>
                    </select>

                    <select
                        value={filters.division}
                        onChange={(e) => setFilters({ ...filters, division: e.target.value })}
                        className="input-field"
                    >
                        <option value="">All Divisions</option>
                        <option value="personal">Personal</option>
                        <option value="office">Office</option>
                    </select>

                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        className="input-field"
                        placeholder="Start Date"
                    />

                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        className="input-field"
                        placeholder="End Date"
                    />

                    <button
                        onClick={() => setFilters({ type: '', category: '', division: '', startDate: '', endDate: '' })}
                        className="btn-secondary"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div className="card">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No transactions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Division</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction: Transaction) => (
                                    <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm text-gray-600">
                                            {formatDateTime(transaction.date)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                                {transaction.accountId && (
                                                    <p className="text-sm text-gray-500">{(transaction.accountId as Account).name}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600 capitalize">
                                            {transaction.category}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                                {transaction.division}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTransactionColor(transaction.type)}`}>
                                                {getTransactionIcon(transaction.type)}
                                                <span className="ml-1">{transaction.type}</span>
                                            </span>
                                        </td>
                                        <td className={`py-4 px-4 text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(transaction)}
                                                    disabled={!transaction.isEditable}
                                                    className={`p-2 rounded-lg transition-colors ${transaction.isEditable
                                                        ? 'text-blue-600 hover:bg-blue-50'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    title={transaction.isEditable ? 'Edit' : 'Can only edit within 12 hours'}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(transaction._id)}
                                                    disabled={!transaction.isEditable}
                                                    className={`p-2 rounded-lg transition-colors ${transaction.isEditable
                                                        ? 'text-red-600 hover:bg-red-50'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    title={transaction.isEditable ? 'Delete' : 'Can only delete within 12 hours'}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
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
    );
};

export default Transactions;