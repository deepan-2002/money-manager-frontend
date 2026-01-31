import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { accountService } from '../services/accountService';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    ArrowUpRight,
    ArrowDownLeft,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Wallet,
    Filter,
    RefreshCw,
} from 'lucide-react';

const AccountDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 50
    });

    useEffect(() => {
        fetchAccountTransactions();
    }, [id, filters]);

    const fetchAccountTransactions = async () => {
        try {
            setLoading(true);
            const response = await accountService.getAccountTransactions(id || "", filters);
            setData(response);
        } catch (error: any) {
            toast.error('Failed to load account transactions');
            if (error.response?.status === 404) {
                navigate('/accounts');
            }
        } finally {
            setLoading(false);
        }
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

    const getAmountDisplay = (transaction: any) => {
        // If it's a transfer TO this account
        if (transaction.type === 'transfer' && transaction.toAccountId?._id === id) {
            return {
                sign: '+',
                color: 'text-green-600'
            };
        }
        // If it's a transfer FROM this account
        if (transaction.type === 'transfer' && transaction.accountId?._id === id) {
            return {
                sign: '-',
                color: 'text-red-600'
            };
        }
        // Regular income/expense
        return {
            sign: transaction.type === 'income' ? '+' : '-',
            color: transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        };
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const { account, summary, data: transactions, count, currentPage, totalPages } = data;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <Link
                to="/accounts"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Accounts
            </Link>

            {/* Account Header */}
            <div className="card mb-8 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{account.name}</h1>
                        <p className="text-primary-100 capitalize mb-4">{account.type.replace('_', ' ')}</p>
                        <div className="flex items-center space-x-2 text-4xl font-bold">
                            <Wallet className="h-10 w-10" />
                            <span>{formatCurrency(account.balance)}</span>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-4">
                        {/* <button
                            onClick={async () => {
                                try {
                                    await accountService.recalibrateAccount(id || "");
                                    toast.success('Balance recalibrated!');
                                    fetchAccountTransactions();
                                } catch (error) {
                                    toast.error('Recalculation failed');
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all text-sm font-medium border border-white/30 shadow-lg"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Sync Balance
                        </button> */}
                        <div>
                            <p className="text-primary-100 text-sm mb-1">Total Transactions</p>
                            <p className="text-2xl font-bold">{summary.transactionCount || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Total Income */}
                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Total Income</h3>
                        <TrendingUp className="h-8 w-8 opacity-80" />
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(summary.totalIncome || 0)}</p>
                    <p className="text-green-100 text-sm mt-2">Money received in this account</p>
                </div>

                {/* Total Expenses */}
                <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Total Expenses</h3>
                        <TrendingDown className="h-8 w-8 opacity-80" />
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(summary.totalExpense || 0)}</p>
                    <p className="text-red-100 text-sm mt-2">Money spent from this account</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold">Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                        className="input-field"
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                        <option value="transfer">Transfer</option>
                    </select>

                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                        className="input-field"
                        placeholder="Start Date"
                    />

                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
                        className="input-field"
                        placeholder="End Date"
                    />

                    <button
                        onClick={() => setFilters({ type: '', startDate: '', endDate: '', page: 1, limit: 50 })}
                        className="btn-secondary"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Transaction History</h3>
                    <p className="text-sm text-gray-600">
                        Showing {transactions.length} of {count} transactions
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No transactions found for this account</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Transfer Info</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction: any) => {
                                        const amountDisplay = getAmountDisplay(transaction);
                                        return (
                                            <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {formatDateTime(transaction.date)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{transaction.description}</p>
                                                        <p className="text-sm text-gray-500 capitalize">{transaction.division}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600 capitalize">
                                                    {transaction.category}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTransactionColor(transaction.type)}`}>
                                                        {getTransactionIcon(transaction.type)}
                                                        <span className="ml-1">{transaction.type}</span>
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {transaction.type === 'transfer' && (
                                                        <div>
                                                            {transaction.toAccountId?._id === id ? (
                                                                <span className="text-green-600">
                                                                    From: {transaction.accountId?.name || 'Unknown'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    To: {transaction.toAccountId?.name || 'Unknown'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className={`py-4 px-4 text-right font-semibold ${amountDisplay.color}`}>
                                                    {amountDisplay.sign}{formatCurrency(transaction.amount)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 pt-6 border-t">
                                <button
                                    onClick={() => setFilters({ ...filters, page: Math.max(1, currentPage - 1) })}
                                    disabled={currentPage === 1}
                                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setFilters({ ...filters, page: Math.min(totalPages, currentPage + 1) })}
                                    disabled={currentPage === totalPages}
                                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountDetails;