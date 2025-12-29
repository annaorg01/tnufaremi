'use client';

import React, { useState } from 'react';
import { MoneyLeftRecord, formatCurrency, formatPercent } from '@/lib/data';

interface MoneyLeftTableProps {
    data: MoneyLeftRecord[];
}

export function MoneyLeftTable({ data }: MoneyLeftTableProps) {
    const [selectedRecord, setSelectedRecord] = useState<MoneyLeftRecord | null>(null);

    return (
        <div className="glass-card rounded-2xl p-6 border border-slate-700">
            {/* Header with explanation */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                        מכרזים ללא מינימום
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        מכרזים שבהם לא הוגדר מחיר מינימום - פער בין הזוכה להצעה השנייה
                    </p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-300 max-w-52">
                    <p className="font-medium text-amber-400 mb-1">💡 למה זה חשוב?</p>
                    <p>פערים גדולים = הזוכה יכל לזכות בפחות. אולי צריך יותר פרסום.</p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">
                    אין נתונים זמינים
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-600">
                                <th className="text-right py-3 px-3 text-slate-300 font-semibold text-sm">מיקום</th>
                                <th className="text-right py-3 px-3 text-slate-300 font-semibold text-sm">זוכה</th>
                                <th className="text-right py-3 px-3 text-slate-300 font-semibold text-sm">פער</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((record, index) => (
                                <tr
                                    key={index}
                                    onClick={() => setSelectedRecord(selectedRecord?.tender_id === record.tender_id ? null : record)}
                                    className={`border-b border-slate-700/50 cursor-pointer transition-colors ${selectedRecord?.tender_id === record.tender_id
                                            ? 'bg-amber-500/20'
                                            : 'hover:bg-slate-800/50'
                                        }`}
                                >
                                    <td className="py-3 px-3">
                                        <div className="text-white text-sm font-medium">
                                            {(record.neighborhood || record.city).substring(0, 15)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="text-slate-200 text-sm" title={record.winner_name}>
                                            {record.winner_name.length > 20 ? record.winner_name.substring(0, 20) + '...' : record.winner_name}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="text-amber-400 font-bold text-sm">
                                            {formatCurrency(record.gap)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Selected record details */}
            {selectedRecord && (
                <div className="mt-4 p-4 bg-slate-800/80 rounded-lg border border-amber-500/30">
                    <p className="text-white font-medium mb-3">📋 פרטי מכרז</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400 text-xs">מיקום</p>
                            <p className="text-white font-medium">{selectedRecord.neighborhood || selectedRecord.city}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400 text-xs">זוכה</p>
                            <p className="text-white font-medium text-xs">{selectedRecord.winner_name.substring(0, 35)}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400 text-xs">מחיר זוכה</p>
                            <p className="text-emerald-400 font-bold">{formatCurrency(selectedRecord.winning_price)}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400 text-xs">הצעה שנייה</p>
                            <p className="text-slate-300 font-bold">{formatCurrency(selectedRecord.second_bid)}</p>
                        </div>
                        <div className="bg-amber-500/20 rounded p-2 col-span-2">
                            <p className="text-amber-400 text-xs">הפער ("כסף על השולחן")</p>
                            <p className="text-amber-300 font-bold text-lg">{formatCurrency(selectedRecord.gap)} ({formatPercent(selectedRecord.gapPercent)})</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedRecord(null)}
                        className="mt-3 text-xs text-blue-400 hover:text-blue-300"
                    >
                        ✕ סגור
                    </button>
                </div>
            )}
        </div>
    );
}
