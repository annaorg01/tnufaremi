'use client';

import React, { useState } from 'react';

interface SummaryCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: string;
    trendPositive?: boolean;
    explanation?: string;
    onClick?: () => void;
}

export function SummaryCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    trendPositive,
    explanation,
    onClick
}: SummaryCardProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className={`glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 relative ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-slate-300 text-sm font-medium">{title}</p>
                        {explanation && (
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowTooltip(!showTooltip);
                                    }}
                                    className="w-4 h-4 rounded-full bg-slate-600 text-slate-300 text-xs flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                                >
                                    ?
                                </button>
                                {showTooltip && (
                                    <div className="absolute z-50 top-6 right-0 w-64 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl text-xs text-slate-300 leading-relaxed">
                                        {explanation}
                                        <div className="absolute -top-2 right-1 w-3 h-3 bg-slate-800 border-t border-r border-slate-600 transform rotate-[-45deg]"></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{value}</p>
                    {subtitle && (
                        <p className="text-slate-400 text-xs">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 ${trendPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                            <span className="text-sm font-medium">{trend}</span>
                            <svg
                                className={`w-4 h-4 ${trendPositive ? '' : 'rotate-180'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-blue-300">
                    {icon}
                </div>
            </div>
            {onClick && (
                <div className="absolute bottom-2 left-2 text-xs text-blue-400 opacity-60">
                    לחץ לפרטים ←
                </div>
            )}
        </div>
    );
}

// Icons with better visibility
export const Icons = {
    revenue: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    tenders: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    percent: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    location: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
};
