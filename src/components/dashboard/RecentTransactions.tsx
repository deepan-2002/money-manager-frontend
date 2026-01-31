import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { ArrowUpRight, ArrowDownLeft, ArrowRight, Clock, ArrowRightCircle } from 'lucide-react';
import type { Account, Transaction } from '../../types';

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'income':
                return <ArrowUpRight className="h-5 w-5" />;
            case 'expense':
                return <ArrowDownLeft className="h-5 w-5" />;
            case 'transfer':
                return <ArrowRight className="h-5 w-5" />;
            default:
                return null;
        }
    };

    const getTransactionStyle = (type: string) => {
        switch (type) {
            case 'income':
                return {
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    amountColor: 'text-emerald-600'
                };
            case 'expense':
                return {
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-600',
                    amountColor: 'text-rose-600'
                };
            case 'transfer':
                return {
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    amountColor: 'text-blue-600'
                };
            default:
                return {
                    iconBg: 'bg-slate-100',
                    iconColor: 'text-slate-600',
                    amountColor: 'text-slate-600'
                };
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                        <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
                        <p className="text-sm text-slate-600">Latest financial activities</p>
                    </div>
                </div>
                <Link
                    to="/transactions"
                    className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all"
                >
                    <span>View All</span>
                    <ArrowRightCircle className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                        <Clock className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium mb-2">No transactions yet</p>
                    <p className="text-sm text-slate-500">Start adding transactions to see them here</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((transaction) => {
                        const style = getTransactionStyle(transaction.type);
                        return (
                            <div
                                key={transaction._id}
                                className="group relative overflow-hidden flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 rounded-2xl hover:shadow-md transition-all duration-200"
                            >
                                {/* Accent line */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${transaction.type === 'income' ? 'bg-emerald-500' :
                                        transaction.type === 'expense' ? 'bg-rose-500' : 'bg-blue-500'
                                    } transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top`}></div>

                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className={`p-3 ${style.iconBg} ${style.iconColor} rounded-xl shrink-0`}>
                                        {getTransactionIcon(transaction.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 mb-1 truncate">
                                            {transaction.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                            <span className="inline-flex items-center px-2 py-1 bg-slate-200 text-slate-700 rounded-md font-medium capitalize">
                                                {transaction.category}
                                            </span>
                                            <span className="text-slate-400">•</span>
                                            <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md font-medium capitalize">
                                                {transaction.division}
                                            </span>
                                            <span className="text-slate-400">•</span>
                                            <span className="text-slate-500 font-medium">
                                                {formatDateTime(transaction.date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <p className={`text-lg font-bold ${style.amountColor}`}>
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatCurrency(transaction.amount)}
                                    </p>
                                    {transaction.accountId && (
                                        <p className="text-xs text-slate-500 mt-1 font-medium">
                                            {(transaction.accountId as Account).name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecentTransactions;