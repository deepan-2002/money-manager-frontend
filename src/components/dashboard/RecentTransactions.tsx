import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { ArrowUpRight, ArrowDownLeft, ArrowRight } from 'lucide-react';
import type { Account, Transaction } from '../../types';

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
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
                return 'text-green-600';
            case 'expense':
                return 'text-red-600';
            case 'transfer':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <Link to="/transactions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                </Link>
            </div>

            {transactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No transactions yet</p>
            ) : (
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-white rounded-full">
                                    {getTransactionIcon(transaction.type)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{transaction.description}</p>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span>{transaction.category}</span>
                                        <span>•</span>
                                        <span className="capitalize">{transaction.division}</span>
                                        <span>•</span>
                                        <span>{formatDateTime(transaction.date)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                                    {transaction.type === 'income' ? '+' : '-'}
                                    {formatCurrency(transaction.amount)}
                                </p>
                                {transaction.accountId && (
                                    <p className="text-sm text-gray-500">{(transaction.accountId as Account).name}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentTransactions;