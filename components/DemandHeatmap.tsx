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
import { NeighborhoodStats, formatNumber, formatCurrency } from '@/lib/data';

interface DemandHeatmapProps {
    data: NeighborhoodStats[];
    onItemClick?: (item: NeighborhoodStats) => void;
}

// Color scale for demand intensity - brighter colors
const getColor = (value: number, max: number) => {
    const ratio = value / max;
    if (ratio > 0.8) return '#a855f7'; // Purple - very high
    if (ratio > 0.6) return '#3b82f6'; // Blue - high
    if (ratio > 0.4) return '#06b6d4'; // Cyan - medium-high
    if (ratio > 0.2) return '#22c55e'; // Green - medium
    return '#84cc16'; // Lime - low
};

export function DemandHeatmap({ data, onItemClick }: DemandHeatmapProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const maxDemand = Math.max(...data.map((d) => d.demandPerUnit), 0.01);

    const chartData = data.map((item, idx) => ({
        name: item.neighborhood.substring(0, 12),
        fullName: item.neighborhood,
        city: item.city,
        ביקוש: item.demandPerUnit,
        הצעות: item.bidCount,
        יחידות: item.units,
        avgPrice: item.avgPrice,
        tenders: item.tenders,
        originalData: item,
        idx,
    }));

    return (
        <div className="glass-card rounded-2xl p-6 border border-slate-700">
            {/* Header with explanation */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        מפת ביקוש לפי שכונות
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        יחס הצעות ליחידות דיור
                    </p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-300 max-w-48">
                    <p className="font-medium text-blue-400 mb-1">💡 למה זה חשוב?</p>
                    <p>ביקוש גבוה = אזור אטרקטיבי. כדאי להקצות שם יותר קרקעות.</p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">
                    אין נתוני ביקוש זמינים
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
                                tickFormatter={(value) => value.toFixed(2)}
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
                                formatter={(value: number, name: string) => {
                                    if (name === 'ביקוש') return [value.toFixed(3), 'הצעות ליחידה'];
                                    return [formatNumber(value), name === 'הצעות' ? 'סה"כ הצעות' : 'יחידות דיור'];
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
                                dataKey="ביקוש"
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
                                        fill={getColor(entry.ביקוש, maxDemand)}
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

            {/* Color scale legend */}
            <div className="flex justify-center items-center gap-2 mt-4">
                <span className="text-slate-300 text-xs">ביקוש נמוך</span>
                <div className="flex h-4 rounded overflow-hidden">
                    <div className="w-8 bg-lime-500"></div>
                    <div className="w-8 bg-green-500"></div>
                    <div className="w-8 bg-cyan-500"></div>
                    <div className="w-8 bg-blue-500"></div>
                    <div className="w-8 bg-purple-500"></div>
                </div>
                <span className="text-slate-300 text-xs">ביקוש גבוה</span>
            </div>

            {/* Selected item details */}
            {selectedIndex !== null && chartData[selectedIndex] && (
                <div className="mt-4 p-4 bg-slate-800/80 rounded-lg border border-slate-600">
                    <p className="text-white font-medium mb-2">📋 פרטי שכונה נבחרת</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-slate-400">שכונה:</span> <span className="text-white">{chartData[selectedIndex].fullName}</span></div>
                        <div><span className="text-slate-400">עיר:</span> <span className="text-white">{chartData[selectedIndex].city}</span></div>
                        <div><span className="text-slate-400">מכרזים:</span> <span className="text-blue-400">{chartData[selectedIndex].tenders}</span></div>
                        <div><span className="text-slate-400">יחידות:</span> <span className="text-white">{formatNumber(chartData[selectedIndex].יחידות)}</span></div>
                        <div><span className="text-slate-400">הצעות:</span> <span className="text-purple-400">{chartData[selectedIndex].הצעות}</span></div>
                        <div><span className="text-slate-400">מחיר ממוצע:</span> <span className="text-emerald-400">{formatCurrency(chartData[selectedIndex].avgPrice)}</span></div>
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
