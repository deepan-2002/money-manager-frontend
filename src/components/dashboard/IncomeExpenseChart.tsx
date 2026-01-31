import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../utils/helpers';


interface IncomeExpenseChartProps {
    data: any[];
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{payload[0].payload.period}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Income vs Expenses Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Income"
                    />
                    <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Expenses"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeExpenseChart;