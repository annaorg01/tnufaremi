'use client';

import React from 'react';
import { CityStats, formatCurrency, formatNumber } from '@/lib/data';

interface CityTableProps {
    data: CityStats[];
    onCityClick?: (cityName: string) => void;
}

export function CityTable({ data, onCityClick }: CityTableProps) {
    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                פילוח לפי ערים
            </h3>
            <p className="text-slate-400 text-sm mb-4">
                השוואת ביצועים בין ערים
            </p>

            {data.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-500">
                    אין נתוני ערים זמינים
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-right py-3 px-3 text-slate-400 font-medium text-xs">עיר</th>
                                <th className="text-right py-3 px-3 text-slate-400 font-medium text-xs">מכרזים</th>
                                <th className="text-right py-3 px-3 text-slate-400 font-medium text-xs">הכנסות</th>
                                <th className="text-right py-3 px-3 text-slate-400 font-medium text-xs">חציון</th>
                                <th className="text-right py-3 px-3 text-slate-400 font-medium text-xs">הצעות ממוצע</th>
                                <th className="text-right py-3 px-3 text-slate-400 font-medium text-xs">יחידות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((city, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                                    onClick={() => onCityClick && onCityClick(city.city)}
                                >
                                    <td className="py-2 px-3">
                                        <span className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-2">
                                            {city.city}
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </td>
                                    <td className="py-2 px-3">
                                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                                            {city.tenders}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3">
                                        <span className="text-emerald-400 font-medium text-sm">
                                            {formatCurrency(city.revenue)}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3">
                                        <span className="text-slate-300 text-sm">
                                            {formatCurrency(city.medianPrice)}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3">
                                        <span className="text-slate-300 text-sm">
                                            {city.avgBidCount.toFixed(1)}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3">
                                        <span className="text-slate-400 text-sm">
                                            {formatNumber(city.units)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
