'use client';

import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { AnomalyRecord, formatCurrency, formatPercent } from '@/lib/data';

interface DiscrepancyChartProps {
    data: AnomalyRecord[];
    onItemClick?: (item: AnomalyRecord) => void;
}

export function DiscrepancyChart({ data, onItemClick }: DiscrepancyChartProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const chartData = data.map((item, idx) => ({
        name: (item.neighborhood || item.city).substring(0, 12),
        fullName: item.neighborhood || item.city,
        פער: Math.min(Math.max(item.discrepancyPercent, -200), 200), // Clamp for display
        actualPercent: item.discrepancyPercent,
        מחיר_זכייה: item.winning_price,
        שומה: item.appraisal_price,
        winner: item.winner_name,
        originalData: item,
        idx,
    }));

    return (
        <div className="glass-card rounded-2xl p-6 border border-slate-700">
            {/* Header with explanation */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                        זיהוי חריגות - פערי מחירים
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        מכרזים עם פער משמעותי בין מחיר הזכייה לשומה
                    </p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-300 max-w-48">
                    <p className="font-medium text-blue-400 mb-1">💡 למה זה חשוב?</p>
                    <p>פער חיובי = יזמים רואים ערך גבוה יותר. פער שלילי = אולי השומה גבוהה מדי.</p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">
                    לא נמצאו חריגות משמעותיות
                </div>
            ) : (
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis
                                type="number"
                                stroke="#cbd5e1"
                                tickFormatter={(value) => `${value}%`}
                                fontSize={11}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#cbd5e1"
                                width={100}
                                tick={{ fontSize: 10, fill: '#e2e8f0' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.98)',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    direction: 'rtl',
                                    padding: '12px',
                                }}
                                formatter={(value: number, name: string, props: any) => {
                                    if (name === 'פער') {
                                        return [`${props.payload.actualPercent.toFixed(1)}%`, 'פער מהשומה'];
                                    }
                                    return [formatCurrency(value), name === 'מחיר_זכייה' ? 'מחיר זכייה' : 'שומה'];
                                }}
                                labelFormatter={(label, payload) => {
                                    if (payload && payload[0]) {
                                        return `📍 ${payload[0].payload.fullName}`;
                                    }
                                    return label;
                                }}
                                labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}
                            />
                            <Bar
                                dataKey="פער"
                                radius={[0, 6, 6, 0]}
                                cursor="pointer"
                                onClick={(data) => {
                                    setSelectedIndex(data.idx);
                                    if (onItemClick) onItemClick(data.originalData);
                                }}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.פער > 0 ? '#10b981' : '#ef4444'}
                                        opacity={selectedIndex === null || selectedIndex === index ? 1 : 0.4}
                                        stroke={selectedIndex === index ? '#fff' : 'none'}
                                        strokeWidth={2}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Legend with better contrast */}
            <div className="flex justify-center gap-8 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-500"></div>
                    <span className="text-slate-200">מעל השומה (טוב)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-rose-500"></div>
                    <span className="text-slate-200">מתחת לשומה</span>
                </div>
            </div>

            {/* Selected item details */}
            {selectedIndex !== null && chartData[selectedIndex] && (
                <div className="mt-4 p-4 bg-slate-800/80 rounded-lg border border-slate-600">
                    <p className="text-white font-medium mb-2">📋 פרטי מכרז נבחר</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-slate-400">שכונה:</span> <span className="text-white">{chartData[selectedIndex].fullName}</span></div>
                        <div><span className="text-slate-400">זוכה:</span> <span className="text-white">{chartData[selectedIndex].winner?.substring(0, 25)}...</span></div>
                        <div><span className="text-slate-400">מחיר זכייה:</span> <span className="text-emerald-400">{formatCurrency(chartData[selectedIndex].מחיר_זכייה)}</span></div>
                        <div><span className="text-slate-400">שומה:</span> <span className="text-slate-300">{formatCurrency(chartData[selectedIndex].שומה)}</span></div>
                    </div>
                    <button
                        onClick={() => setSelectedIndex(null)}
                        className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                    >
                        ✕ סגור
                    </button>
                </div>
            )}
        </div>
    );
}
