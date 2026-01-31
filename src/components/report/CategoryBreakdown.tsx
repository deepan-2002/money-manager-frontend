import React from "react";
import { formatCurrency } from "../../utils/helpers";
import CategoryChart from "./CategoryChart";
import { ListChecks } from "lucide-react";

const CategoryBreakdown: React.FC<{ categoryBreakdown: any }> = ({ categoryBreakdown }) => {

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart categoryBreakdown={categoryBreakdown} />

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <ListChecks className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Category Details</h3>
                        <p className="text-sm text-slate-600">Breakdown by spending category</p>
                    </div>
                </div>
                {categoryBreakdown?.breakdown?.length > 0 ? (
                    <div className="space-y-3">
                        {categoryBreakdown.breakdown.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden flex items-center justify-between p-4 bg-slate-50 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200"
                            >
                                {/* Progress bar background */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 opacity-10 transition-all duration-300"
                                    style={{
                                        width: `${item.percentage}%`,
                                        backgroundColor: COLORS[index % COLORS.length]
                                    }}
                                ></div>

                                <div className="relative flex items-center gap-3 flex-1">
                                    <div
                                        className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="font-semibold text-slate-900 capitalize">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="relative text-right">
                                    <p className="text-lg font-bold text-slate-900">
                                        {formatCurrency(item.total)}
                                    </p>
                                    <div className="flex items-center gap-2 justify-end mt-1">
                                        <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${item.percentage}%`,
                                                    backgroundColor: COLORS[index % COLORS.length]
                                                }}
                                            ></div>
                                        </div>
                                        <span
                                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                                            style={{
                                                color: COLORS[index % COLORS.length],
                                                backgroundColor: `${COLORS[index % COLORS.length]}20`
                                            }}
                                        >
                                            {item.percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Total Summary */}
                        <div className="mt-4 pt-4 border-t-2 border-slate-200">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl">
                                <span className="text-sm font-bold text-slate-700">Total Expenses</span>
                                <span className="text-xl font-bold text-slate-900">
                                    {formatCurrency(categoryBreakdown.breakdown.reduce((sum: number, item: any) => sum + item.total, 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                            <ListChecks className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">No category data available</p>
                        <p className="text-sm text-slate-500 mt-1">Start adding expenses to see breakdown</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryBreakdown;