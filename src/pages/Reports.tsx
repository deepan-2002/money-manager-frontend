import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import CategoryBreakdown from '../components/report/CategoryBreakdown';

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
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>

            {/* Category Breakdown */}
            <CategoryBreakdown categoryBreakdown={categoryBreakdown} />

            {/* Division Breakdown */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Division Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {divisionBreakdown.map((division: any, index: number) => (
                        <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                            <h4 className="text-xl font-bold capitalize mb-4">{division.division}</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Income:</span>
                                    <span className="font-semibold text-green-600">
                                        {formatCurrency(division.income)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Expenses:</span>
                                    <span className="font-semibold text-red-600">
                                        {formatCurrency(division.expense)}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t">
                                    <span className="font-medium">Balance:</span>
                                    <span className={`font-bold ${division.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(division.balance)}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {division.transactionCount} transactions
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;