'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatPercent } from '@/lib/data';

interface PriceGapSliderProps {
    data: Array<{
        tender_id: string;
        city: string;
        neighborhood: string;
        winning_price: number;
        appraisal_price: number;
        discrepancy: number;
        discrepancyPercent: number;
        winner_name: string;
    }>;
}

export default function PriceGapSlider({ data }: PriceGapSliderProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);

    useEffect(() => {
        if (!autoPlay || data.length === 0) return;

        const interval = setInterval(() => {
            setSelectedIndex(prev => (prev + 1) % data.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [autoPlay, data.length]);

    if (data.length === 0) {
        return (
            <div className="glass-card rounded-2xl p-6 border border-slate-600">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    פער מחירים: שומה לעומת זכייה
                </h2>
                <p className="text-slate-400 text-center py-8">אין נתונים זמינים להצגה</p>
            </div>
        );
    }

    const selectedItem = data[selectedIndex];
    const gapPercent = selectedItem.discrepancyPercent;
    const gapAmount = selectedItem.discrepancy;
    const appraisal = selectedItem.appraisal_price;
    const winning = selectedItem.winning_price;

    // Calculate slider position (0-100%)
    const sliderPosition = Math.min(Math.max(((gapPercent + 100) / 200) * 100, 0), 100);

    return (
        <div className="glass-card rounded-2xl p-6 border border-slate-600">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    פער מחירים: שומה לעומת זכייה
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={`px-3 py-1 rounded-lg text-sm ${autoPlay ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-slate-700 text-slate-300 border border-slate-600'}`}
                    >
                        {autoPlay ? '⏸️ השהה' : '▶️ הפעל'}
                    </button>
                    <div className="text-sm text-slate-400">
                        {selectedIndex + 1} / {data.length}
                    </div>
                </div>
            </div>

            {/* Project Info */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-white font-medium">{selectedItem.city} - {selectedItem.neighborhood}</h3>
                        <p className="text-slate-400 text-sm">מכרז #{selectedItem.tender_id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-300 text-sm">זוכה: {selectedItem.winner_name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-slate-400 text-sm mb-1">מחיר שומה</p>
                        <p className="text-xl font-bold text-blue-300">{formatCurrency(appraisal)}</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-slate-400 text-sm mb-1">מחיר זכייה</p>
                        <p className="text-xl font-bold text-emerald-300">{formatCurrency(winning)}</p>
                    </div>
                </div>
            </div>

            {/* Visual Slider */}
            <div className="mb-8">
                <div className="relative h-24 bg-slate-800/50 rounded-xl p-4">
                    {/* Appraisal Line */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                        <div className="text-xs text-blue-300 mt-1 text-center">שומה</div>
                    </div>

                    {/* Winning Line */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-12 bg-emerald-500 rounded-full"></div>
                        <div className="text-xs text-emerald-300 mt-1 text-center">זכייה</div>
                    </div>

                    {/* Gap Visualization */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${gapPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {formatPercent(gapPercent)}
                            </div>
                            <div className="text-sm text-slate-400 mt-1">
                                {gapPercent >= 0 ? 'מעל השומה' : 'מתחת לשומה'}
                            </div>
                        </div>
                    </div>

                    {/* Connecting Line */}
                    <div className="absolute left-16 right-16 top-1/2 h-1 bg-slate-600 transform -translate-y-1/2">
                        <div 
                            className="absolute h-1 bg-gradient-to-r from-blue-500 to-emerald-500"
                            style={{ left: '0%', right: `${100 - sliderPosition}%` }}
                        ></div>
                    </div>

                    {/* Gap Amount Indicator */}
                    <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2">
                        <div className="text-sm text-slate-300 bg-slate-900/80 px-3 py-1 rounded-lg">
                            פער: {formatCurrency(Math.abs(gapAmount))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setSelectedIndex(prev => (prev - 1 + data.length) % data.length)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                    ← קודם
                </button>

                <div className="flex gap-1">
                    {data.slice(0, 10).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`w-2 h-2 rounded-full ${idx === selectedIndex ? 'bg-blue-500' : 'bg-slate-600'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => setSelectedIndex(prev => (prev + 1) % data.length)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                    הבא →
                </button>
            </div>

            {/* Stats Summary */}
            <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-slate-400 text-sm">פער ממוצע</p>
                        <p className="text-lg font-bold text-white">
                            {formatPercent(data.reduce((sum, item) => sum + item.discrepancyPercent, 0) / data.length)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-400 text-sm">מעל שומה</p>
                        <p className="text-lg font-bold text-emerald-400">
                            {data.filter(item => item.discrepancyPercent > 0).length} מתוך {data.length}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-400 text-sm">מתחת לשומה</p>
                        <p className="text-lg font-bold text-rose-400">
                            {data.filter(item => item.discrepancyPercent < 0).length} מתוך {data.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
