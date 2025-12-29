'use client';

import React, { useState } from 'react';
import { DeveloperStats, formatCurrency, formatPercent, formatNumber } from '@/lib/data';

interface DeveloperTableProps {
    data: DeveloperStats[];
    onDeveloperClick?: (developerName: string) => void;
}

export function DeveloperTable({ data, onDeveloperClick }: DeveloperTableProps) {
    const [selectedDev, setSelectedDev] = useState<DeveloperStats | null>(null);

    return (
        <div className="glass-card rounded-2xl p-6 border border-slate-700">
            {/* Header with explanation */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        יזמים מובילים
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        דירוג לפי סך הכנסות
                    </p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-300 max-w-52">
                    <p className="font-medium text-purple-400 mb-1">💡 למה זה חשוב?</p>
                    <p>יזמים שזוכים הרבה בעיר = גישה טובה לשוק. אפשר לשקול שותפות.</p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">
                    אין נתוני יזמים זמינים
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-600">
                                <th className="text-right py-3 px-3 text-slate-300 font-semibold text-sm">#</th>
                                <th className="text-right py-3 px-3 text-slate-300 font-semibold text-sm">שם היזם</th>
                                <th className="text-right py-3 px-3 text-slate-300 font-semibold text-sm">זכיות</th>
                                <th className="text-right py-3 px-3 text-slate-300 font-semibold text-sm">סה״כ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((developer, index) => (
                                <tr
                                    key={index}
                                    onClick={() => {
                                        if (onDeveloperClick) {
                                            onDeveloperClick(developer.name);
                                        } else {
                                            setSelectedDev(selectedDev?.name === developer.name ? null : developer);
                                        }
                                    }}
                                    className={`border-b border-slate-700/50 cursor-pointer transition-colors ${selectedDev?.name === developer.name
                                            ? 'bg-blue-500/20'
                                            : 'hover:bg-slate-800/50'
                                        }`}
                                >
                                    <td className="py-3 px-3">
                                        <span className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${index === 0 ? 'bg-yellow-500/30 text-yellow-300' : ''}
                      ${index === 1 ? 'bg-slate-400/30 text-slate-200' : ''}
                      ${index === 2 ? 'bg-amber-600/30 text-amber-400' : ''}
                      ${index > 2 ? 'bg-slate-700/50 text-slate-300' : ''}
                    `}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className={`font-medium text-sm flex items-center gap-2 ${onDeveloperClick ? 'text-purple-400 hover:text-purple-300' : 'text-white'}`} title={developer.name}>
                                            {developer.name.length > 30 ? developer.name.substring(0, 30) + '...' : developer.name}
                                            {onDeveloperClick && (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full text-xs font-semibold">
                                            {developer.wins}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="text-emerald-400 font-bold text-sm">
                                            {formatCurrency(developer.totalRevenue)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Selected developer details */}
            {selectedDev && (
                <div className="mt-4 p-4 bg-slate-800/80 rounded-lg border border-purple-500/30">
                    <p className="text-white font-medium mb-3">📋 פרטי יזם: {selectedDev.name.substring(0, 40)}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400 text-xs">זכיות</p>
                            <p className="text-white font-bold">{selectedDev.wins}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400 text-xs">סה״כ הכנסות</p>
                            <p className="text-emerald-400 font-bold">{formatCurrency(selectedDev.totalRevenue)}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400 text-xs">מחיר ממוצע</p>
                            <p className="text-white font-bold">{formatCurrency(selectedDev.avgPrice)}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400 text-xs">פער ממוצע משומה</p>
                            <p className={`font-bold ${selectedDev.avgDiscrepancy > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {formatPercent(selectedDev.avgDiscrepancy)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedDev(null)}
                        className="mt-3 text-xs text-blue-400 hover:text-blue-300"
                    >
                        ✕ סגור
                    </button>
                </div>
            )}
        </div>
    );
}
