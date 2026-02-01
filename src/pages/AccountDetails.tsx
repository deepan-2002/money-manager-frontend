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
    Calendar,
    X,
    ChevronLeft,
    ChevronRight,
    Activity,
} from 'lucide-react';

const AccountDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
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

    const getAmountDisplay = (transaction: any) => {
        // If it's a transfer TO this account
        if (transaction.type === 'transfer' && transaction.toAccountId?._id === id) {
            return {
                sign: '+',
                color: 'text-emerald-600'
            };
        }
        // If it's a transfer FROM this account
        if (transaction.type === 'transfer' && transaction.accountId?._id === id) {
            return {
                sign: '-',
                color: 'text-rose-600'
            };
        }
        // Regular income/expense
        return {
            sign: transaction.type === 'income' ? '+' : '-',
            color: transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
        };
    };

    const clearFilters = () => {
        setFilters({ type: '', startDate: '', endDate: '', page: 1, limit: 50 });
    };

    const hasActiveFilters = filters.type || filters.startDate || filters.endDate;

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading account details...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const { account, summary, data: transactions, count, currentPage, totalPages } = data;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    to="/accounts"
                    className="group inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-6 font-medium transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Accounts
                </Link>

                {/* Account Header Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl mb-8 transform hover:scale-[1.01] transition-transform duration-300">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>

                    <div className="relative p-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                                    <Wallet className="h-4 w-4 text-white" />
                                    <span className="text-sm font-semibold text-white capitalize">
                                        {account.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-6">{account.name}</h1>
                                <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                                    <div className="text-white/80 text-sm font-medium">Current Balance</div>
                                    <div className="text-4xl font-bold text-white">{formatCurrency(account.balance)}</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Stats */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-center">
                                        <p className="text-white/80 text-sm mb-1">Transactions</p>
                                        <p className="text-2xl font-bold text-white">{summary.transactionCount || 0}</p>
                                    </div>
                                    <div className="px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-center">
                                        <p className="text-white/80 text-sm mb-1">Activity</p>
                                        <div className="flex items-center gap-1 justify-center">
                                            <Activity className="h-5 w-5 text-white" />
                                            <p className="text-xl font-bold text-white">Active</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Total Income */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium mb-1">Total Income</p>
                                    <h3 className="text-3xl font-bold text-white">{formatCurrency(summary.totalIncome || 0)}</h3>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <p className="text-emerald-100 text-sm">Money received in this account</p>
                        </div>
                    </div>

                    {/* Total Expenses */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-rose-100 text-sm font-medium mb-1">Total Expenses</p>
                                    <h3 className="text-3xl font-bold text-white">{formatCurrency(summary.totalExpense || 0)}</h3>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <TrendingDown className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <p className="text-rose-100 text-sm">Money spent from this account</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
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
                                {[filters.type, filters.startDate, filters.endDate].filter(v => v).length}
                            </span>
                        )}
                    </button>
                </div>

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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                                className="px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                            >
                                <option value="">All Types</option>
                                <option value="income">💰 Income</option>
                                <option value="expense">💸 Expense</option>
                                <option value="transfer">🔄 Transfer</option>
                            </select>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                />
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
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

                {/* Transactions Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-slate-200">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Showing {transactions.length} of {count} transactions
                            </p>
                        </div>
                    </div>

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
                                <Activity className="h-10 w-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No transactions found</h3>
                            <p className="text-slate-600">
                                {hasActiveFilters ? 'Try adjusting your filters' : 'This account has no transactions yet'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b-2 border-slate-200">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Date</th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Description</th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Category</th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Type</th>
                                            <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Transfer Info</th>
                                            <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {transactions.map((transaction: any) => {
                                            const amountDisplay = getAmountDisplay(transaction);
                                            const style = getTransactionStyle(transaction.type);
                                            return (
                                                <tr key={transaction._id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="py-4 px-6 text-sm text-slate-600">
                                                        {formatDateTime(transaction.date)}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{transaction.description}</p>
                                                            <p className="text-sm text-slate-500 capitalize mt-0.5">{transaction.division}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                                                            {transaction.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${style.badge} capitalize`}>
                                                            {getTransactionIcon(transaction.type)}
                                                            {transaction.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm">
                                                        {transaction.type === 'transfer' && (
                                                            <div>
                                                                {transaction.toAccountId?._id === id ? (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                                                                        <ArrowDownLeft className="h-3 w-3" />
                                                                        From: {transaction.accountId?.name || 'Unknown'}
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 rounded-lg font-medium">
                                                                        <ArrowUpRight className="h-3 w-3" />
                                                                        To: {transaction.toAccountId?.name || 'Unknown'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className={`py-4 px-6 text-right font-bold text-lg ${amountDisplay.color}`}>
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
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-slate-200 bg-slate-50">
                                    <button
                                        onClick={() => setFilters({ ...filters, page: Math.max(1, currentPage - 1) })}
                                        disabled={currentPage === 1}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-slate-600">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setFilters({ ...filters, page: Math.min(totalPages, currentPage + 1) })}
                                        disabled={currentPage === totalPages}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
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

export default AccountDetails;