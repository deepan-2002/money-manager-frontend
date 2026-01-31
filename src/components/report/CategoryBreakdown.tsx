import React from "react";
import { formatCurrency } from "../../utils/helpers";
import CategoryChart from "./CategoryChart";

const CategoryBreakdown: React.FC<{ categoryBreakdown: any }> = ({ categoryBreakdown }) => {

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CategoryChart categoryBreakdown={categoryBreakdown} />

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Category Details</h3>
                <div className="space-y-3">
                    {categoryBreakdown?.breakdown?.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></div>
                                <span className="font-medium capitalize">{item.category}</span>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{formatCurrency(item.total)}</p>
                                <p className="text-sm text-gray-500">{item.percentage}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryBreakdown;