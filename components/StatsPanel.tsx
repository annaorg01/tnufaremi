'use client';

import React from 'react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/data';

interface StatsPanelProps {
    stats: {
        // Price stats
        avgWinningPrice: number;
        medianWinningPrice: number;
        minWinningPrice: number;
        maxWinningPrice: number;
        avgPricePerSqm: number;
        medianPricePerSqm: number;

        // Discrepancy
        avgDiscrepancy: number;
        medianDiscrepancy: number;
        discrepancyP25: number;
        discrepancyP75: number;

        // Bids
        avgBidCount: number;
        medianBidCount: number;
        maxBidCount: number;
        tendersWithNoBids: number;
        tendersWithOneBid: number;
        avgBidSpread: number;

        // Totals
        totalUnits: number;
        totalArea: number;
        totalDevelopmentCosts: number;
        totalRecords: number;
    };
}

function StatBlock({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
    return (
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-xs mb-1">{label}</p>
            <p className="text-white font-semibold text-sm">{value}</p>
            {subValue && <p className="text-slate-500 text-xs mt-1">{subValue}</p>}
        </div>
    );
}

export function StatsPanel({ stats }: StatsPanelProps) {
    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                סטטיסטיקות מתקדמות
            </h3>

            {/* Price Statistics */}
            <div className="mb-6">
                <h4 className="text-slate-400 text-sm font-medium mb-3 border-b border-slate-700 pb-2">
                    📊 מחירי זכייה
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatBlock
                        label="ממוצע"
                        value={formatCurrency(stats.avgWinningPrice)}
                    />
                    <StatBlock
                        label="חציון"
                        value={formatCurrency(stats.medianWinningPrice)}
                    />
                    <StatBlock
                        label="מינימום"
                        value={formatCurrency(stats.minWinningPrice)}
                    />
                    <StatBlock
                        label="מקסימום"
                        value={formatCurrency(stats.maxWinningPrice)}
                    />
                </div>
            </div>

            {/* Price per Sqm */}
            <div className="mb-6">
                <h4 className="text-slate-400 text-sm font-medium mb-3 border-b border-slate-700 pb-2">
                    📐 מחיר למ״ר
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <StatBlock
                        label="ממוצע למ״ר"
                        value={`${formatNumber(stats.avgPricePerSqm)} ₪`}
                    />
                    <StatBlock
                        label="חציון למ״ר"
                        value={`${formatNumber(stats.medianPricePerSqm)} ₪`}
                    />
                </div>
            </div>

            {/* Discrepancy Stats */}
            <div className="mb-6">
                <h4 className="text-slate-400 text-sm font-medium mb-3 border-b border-slate-700 pb-2">
                    📈 פערים משומה
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatBlock
                        label="חציון"
                        value={formatPercent(stats.medianDiscrepancy)}
                    />
                    <StatBlock
                        label="רבעון 25"
                        value={formatPercent(stats.discrepancyP25)}
                    />
                    <StatBlock
                        label="רבעון 75"
                        value={formatPercent(stats.discrepancyP75)}
                    />
                    <StatBlock
                        label="ממוצע"
                        value={formatPercent(stats.avgDiscrepancy)}
                    />
                </div>
            </div>

            {/* Bid Statistics */}
            <div className="mb-6">
                <h4 className="text-slate-400 text-sm font-medium mb-3 border-b border-slate-700 pb-2">
                    🏷️ סטטיסטיקות הצעות
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <StatBlock
                        label="הצעות ממוצע"
                        value={stats.avgBidCount.toFixed(1)}
                    />
                    <StatBlock
                        label="הצעות חציון"
                        value={stats.medianBidCount.toFixed(0)}
                    />
                    <StatBlock
                        label="מקסימום הצעות"
                        value={stats.maxBidCount.toString()}
                    />
                    <StatBlock
                        label="ללא הצעות"
                        value={stats.tendersWithNoBids.toString()}
                        subValue={`מתוך ${stats.totalRecords}`}
                    />
                    <StatBlock
                        label="הצעה אחת"
                        value={stats.tendersWithOneBid.toString()}
                    />
                    <StatBlock
                        label="פיזור הצעות"
                        value={formatPercent(stats.avgBidSpread)}
                    />
                </div>
            </div>

            {/* Totals */}
            <div>
                <h4 className="text-slate-400 text-sm font-medium mb-3 border-b border-slate-700 pb-2">
                    🏗️ סיכומים
                </h4>
                <div className="grid grid-cols-3 gap-3">
                    <StatBlock
                        label="סה״כ יחידות"
                        value={formatNumber(stats.totalUnits)}
                    />
                    <StatBlock
                        label="סה״כ שטח (מ״ר)"
                        value={formatNumber(stats.totalArea)}
                    />
                    <StatBlock
                        label="עלויות פיתוח"
                        value={formatCurrency(stats.totalDevelopmentCosts)}
                    />
                </div>
            </div>
        </div>
    );
}
