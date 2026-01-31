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
    Calendar
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Period Selector */}
            <div className="mb-6 flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-gray-500" />
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="input-field w-auto"
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Income Card */}
                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Total Income</h3>
                        <TrendingUp className="h-8 w-8 opacity-80" />
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(summary?.income || 0)}</p>
                    <p className="text-green-100 text-sm mt-2">
                        {summary?.transactions?.income || 0} transactions
                    </p>
                </div>

                {/* Expense Card */}
                <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Total Expenses</h3>
                        <TrendingDown className="h-8 w-8 opacity-80" />
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(summary?.expense || 0)}</p>
                    <p className="text-red-100 text-sm mt-2">
                        {summary?.transactions?.expense || 0} transactions
                    </p>
                </div>

                {/* Balance Card */}
                <div className={`card bg-gradient-to-br ${(summary?.balance || 0) >= 0
                    ? 'from-blue-500 to-blue-600'
                    : 'from-orange-500 to-orange-600'
                    } text-white`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Net Balance</h3>
                        <Wallet className="h-8 w-8 opacity-80" />
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(summary?.balance || 0)}</p>
                    <p className="text-white text-opacity-80 text-sm mt-2">
                        {(summary?.balance || 0) >= 0 ? 'Surplus' : 'Deficit'}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <IncomeExpenseChart data={trend} />
                <CategoryChart categoryBreakdown={categoryBreakdown} />
            </div>

            {/* Recent Transactions */}
            <RecentTransactions transactions={transactions} />

            {/* Transaction Modal */}
            {showModal && (
                <TransactionModal
                    onClose={() => setShowModal(false)}
                    onSuccess={handleTransactionCreated}
                />
            )}
        </div>
    );
};

export default Dashboard;