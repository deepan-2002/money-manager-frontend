import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import { PieChart as PieChartIcon } from 'lucide-react';

const CategoryChart: React.FC<{ categoryBreakdown: any }> = ({ categoryBreakdown }) => {
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-slate-200">
                    <p className="text-sm font-bold text-slate-900 mb-2 capitalize">
                        {payload[0].payload.category}
                    </p>
                    <p className="text-sm text-slate-600 mb-1">
                        Amount: <span className="font-bold text-slate-900">{formatCurrency(payload[0].value)}</span>
                    </p>
                    <p className="text-sm text-slate-600">
                        Share: <span className="font-bold text-slate-900">{payload[0].payload.percentage}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percentage < 5) return null; // Don't show label for small slices

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="font-bold text-sm"
            >
                {`${percentage}%`}
            </text>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                    <PieChartIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Expense by Category</h3>
                    <p className="text-sm text-slate-600">Visual spending distribution</p>
                </div>
            </div>
            {categoryBreakdown?.breakdown?.length > 0 ? (
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <defs>
                                {COLORS.map((color, index) => (
                                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <Pie
                                data={categoryBreakdown.breakdown}
                                dataKey="total"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={CustomLabel}
                                labelLine={false}
                                strokeWidth={2}
                                stroke="#fff"
                            >
                                {categoryBreakdown.breakdown.map((_: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#gradient-${index % COLORS.length})`}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value: string) => (
                                    <span className="text-sm font-medium text-slate-700 capitalize">{value}</span>
                                )}
                                iconType="circle"
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Summary Stats */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-600 mb-1">Categories</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {categoryBreakdown.breakdown.length}
                                </p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-600 mb-1">Highest</p>
                                <p className="text-lg font-bold text-slate-900 capitalize truncate">
                                    {categoryBreakdown.breakdown[0]?.category || '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                        <PieChartIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">No expense data available</p>
                    <p className="text-sm text-slate-500 mt-1">Add expenses to see the chart</p>
                </div>
            )}
        </div>
    );
};

export default CategoryChart;