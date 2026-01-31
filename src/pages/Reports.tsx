import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import CategoryBreakdown from '../components/report/CategoryBreakdown';
import { BarChart3, TrendingUp, TrendingDown, Users, Briefcase } from 'lucide-react';

const Reports = () => {
    const [period] = useState('month');
    const [categoryBreakdown, setCategoryBreakdown] = useState<any>(null);
    const [divisionBreakdown, setDivisionBreakdown] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, [period]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const [categoryRes, divisionRes] = await Promise.all([
                reportService.getCategoryBreakdown({ type: 'expense' }),
                reportService.getDivisionBreakdown({})
            ]);

            setCategoryBreakdown(categoryRes.data);
            setDivisionBreakdown(divisionRes.data);
        } catch (error) {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                        Reports & Analytics
                    </h1>
                    <p className="text-slate-600 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Analyze your financial performance
                    </p>
                </div>

                {/* Category Breakdown */}
                <div className="mb-8">
                    <CategoryBreakdown categoryBreakdown={categoryBreakdown} />
                </div>

                {/* Division Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Division Summary</h3>
                            <p className="text-sm text-slate-600">Compare personal and office finances</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {divisionBreakdown.map((division: any, index: number) => {
                            const isPersonal = division.division === 'personal';
                            const isPositive = division.balance >= 0;

                            return (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                                >
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-transparent opacity-30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                                    <div className="relative">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-xl ${isPersonal ? 'bg-blue-100' : 'bg-purple-100'}`}>
                                                    {isPersonal ? (
                                                        <Users className="h-6 w-6 text-blue-600" />
                                                    ) : (
                                                        <Briefcase className="h-6 w-6 text-purple-600" />
                                                    )}
                                                </div>
                                                <h4 className="text-xl font-bold text-slate-900 capitalize">
                                                    {division.division}
                                                </h4>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isPositive
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {isPositive ? '✓ Surplus' : '⚠ Deficit'}
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="space-y-4">
                                            {/* Income */}
                                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                                                    </div>
                                                    <span className="font-semibold text-slate-700">Income</span>
                                                </div>
                                                <span className="text-lg font-bold text-emerald-600">
                                                    {formatCurrency(division.income)}
                                                </span>
                                            </div>

                                            {/* Expenses */}
                                            <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-rose-100 rounded-lg">
                                                        <TrendingDown className="h-5 w-5 text-rose-600" />
                                                    </div>
                                                    <span className="font-semibold text-slate-700">Expenses</span>
                                                </div>
                                                <span className="text-lg font-bold text-rose-600">
                                                    {formatCurrency(division.expense)}
                                                </span>
                                            </div>

                                            {/* Net Balance */}
                                            <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${isPositive
                                                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                                                    : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                                                }`}>
                                                <span className="font-bold text-slate-900">Net Balance</span>
                                                <span className={`text-2xl font-bold ${isPositive ? 'text-blue-600' : 'text-amber-600'
                                                    }`}>
                                                    {formatCurrency(division.balance)}
                                                </span>
                                            </div>

                                            {/* Transaction Count */}
                                            <div className="pt-3 border-t border-slate-200">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600">Total Transactions</span>
                                                    <span className="font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                                                        {division.transactionCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Savings Rate (if positive balance) */}
                                        {isPositive && division.income > 0 && (
                                            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-emerald-700">Savings Rate</span>
                                                    <span className="text-lg font-bold text-emerald-700">
                                                        {((division.balance / division.income) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="mt-2 h-2 bg-emerald-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                                        style={{ width: `${Math.min((division.balance / division.income) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Overall Summary */}
                    {divisionBreakdown.length > 0 && (
                        <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                            <h4 className="text-lg font-bold text-slate-900 mb-4">Combined Summary</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                    <p className="text-sm text-slate-600 mb-1">Total Income</p>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        {formatCurrency(divisionBreakdown.reduce((sum: number, d: any) => sum + d.income, 0))}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                    <p className="text-sm text-slate-600 mb-1">Total Expenses</p>
                                    <p className="text-2xl font-bold text-rose-600">
                                        {formatCurrency(divisionBreakdown.reduce((sum: number, d: any) => sum + d.expense, 0))}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                    <p className="text-sm text-slate-600 mb-1">Net Position</p>
                                    <p className={`text-2xl font-bold ${divisionBreakdown.reduce((sum: number, d: any) => sum + d.balance, 0) >= 0
                                            ? 'text-blue-600'
                                            : 'text-amber-600'
                                        }`}>
                                        {formatCurrency(divisionBreakdown.reduce((sum: number, d: any) => sum + d.balance, 0))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;