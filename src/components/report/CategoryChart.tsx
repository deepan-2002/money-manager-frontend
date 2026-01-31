import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/helpers';

const CategoryChart: React.FC<{ categoryBreakdown: any }> = ({ categoryBreakdown }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Expense by Category</h3>
            {categoryBreakdown?.breakdown?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={categoryBreakdown.breakdown}
                            dataKey="total"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={(entry: any) => `${entry.category}: ${entry.percentage}%`}
                        >
                            {categoryBreakdown.breakdown.map((_: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-gray-500 py-8">No data available</p>
            )}
        </div>
    )
}

export default CategoryChart;
