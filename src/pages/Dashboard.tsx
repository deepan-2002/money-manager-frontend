import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { transactionService } from '../services/transactionService';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Plus,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from 'lucide-react';
import TransactionModal from '../components/transactions/TransactionModal';
import type { Transaction } from '../types';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import CategoryChart from '../components/report/CategoryChart';

const Dashboard = () => {
    const [summary, setSummary] = useState<any>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [trend, setTrend] = useState<Transaction[]>([]);
    const [period, setPeriod] = useState('month');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [categoryBreakdown, setCategoryBreakdown] = useState<any>(null);

    useEffect(() => {
        fetchDashboardData();
    }, [period]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [summaryRes, trendRes, transactionsRes, categoryBreakdownRes] = await Promise.all([
                reportService.getDashboardSummary({ period }),
                reportService.getTrend({ period, groupBy: period === 'week' ? 'day' : 'month' }),
                transactionService.getTransactions({ limit: 10 }),
                reportService.getCategoryBreakdown({ type: 'expense' }),
            ]);

            setSummary(summaryRes.data);
            setTrend(trendRes.data);
            setTransactions(transactionsRes.data);
            setCategoryBreakdown(categoryBreakdownRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionCreated = () => {
        setShowModal(false);
        fetchDashboardData();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                            Financial Overview
                        </h1>
                        <p className="text-slate-600 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Track your income, expenses, and savings
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
                        <Plus className="h-5 w-5" />
                        <span>Add Transaction</span>
                    </button>
                </div>

                {/* Period Selector */}
                <div className="mb-8 inline-flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-200">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-transparent border-none text-slate-700 font-medium focus:outline-none focus:ring-0 cursor-pointer"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Income Card */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium mb-1">Total Income</p>
                                    <h3 className="text-3xl font-bold text-white">{formatCurrency(summary?.income || 0)}</h3>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <ArrowUpRight className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-100">
                                <TrendingUp className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    {summary?.transactions?.income || 0} transactions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Expense Card */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-rose-100 text-sm font-medium mb-1">Total Expenses</p>
                                    <h3 className="text-3xl font-bold text-white">{formatCurrency(summary?.expense || 0)}</h3>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <ArrowDownRight className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-rose-100">
                                <TrendingDown className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    {summary?.transactions?.expense || 0} transactions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <div className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${(summary?.balance || 0) >= 0
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                            : 'bg-gradient-to-br from-amber-500 to-amber-600'
                        }`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-white/90 text-sm font-medium mb-1">Net Balance</p>
                                    <h3 className="text-3xl font-bold text-white">{formatCurrency(summary?.balance || 0)}</h3>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Wallet className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${(summary?.balance || 0) >= 0
                                        ? 'bg-emerald-400/30 text-white'
                                        : 'bg-rose-400/30 text-white'
                                    }`}>
                                    {(summary?.balance || 0) >= 0 ? '✓ Surplus' : '⚠ Deficit'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
                        <IncomeExpenseChart data={trend} />
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
                        <CategoryChart categoryBreakdown={categoryBreakdown} />
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
                    <RecentTransactions transactions={transactions} />
                </div>

                {/* Transaction Modal */}
                {showModal && (
                    <TransactionModal
                        onClose={() => setShowModal(false)}
                        onSuccess={handleTransactionCreated}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;