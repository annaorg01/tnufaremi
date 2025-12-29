'use client';

import React from 'react';
import { TenderRecord, formatCurrency, formatNumber, formatPercent } from '@/lib/data';

interface CityDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    cityName: string;
    tenders: TenderRecord[];
}

export default function CityDetailModal({ isOpen, onClose, cityName, tenders }: CityDetailModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="glass-card rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-blue-500/40">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{cityName}</h2>
                        <p className="text-slate-400 text-sm mt-1">
                            {tenders.length} מכרזים | סה"כ הכנסות: {formatCurrency(tenders.reduce((sum, t) => sum + t.winning_price, 0))}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {tenders.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-500">
                            אין מכרזים זמינים עבור עיר זו
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tenders.map((tender, index) => {
                                const discrepancy = tender.appraisal_price > 0
                                    ? ((tender.winning_price - tender.appraisal_price) / tender.appraisal_price) * 100
                                    : 0;
                                const pricePerSqm = tender.area_sqm > 0 ? tender.winning_price / tender.area_sqm : 0;

                                return (
                                    <div
                                        key={index}
                                        className="glass-card rounded-xl p-4 border border-slate-600 hover:border-blue-500/40 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-white font-semibold text-lg">
                                                    מכרז #{tender.tender_number}
                                                </h3>
                                                <p className="text-slate-400 text-sm">{tender.neighborhood || 'לא צוין'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-emerald-400 font-bold text-xl">
                                                    {formatCurrency(tender.winning_price)}
                                                </p>
                                                <p className="text-slate-400 text-xs">מחיר זכייה</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                            <div className="bg-slate-800/50 rounded-lg p-3">
                                                <p className="text-slate-400 text-xs mb-1">זוכה</p>
                                                <p className="text-white text-sm font-medium truncate">
                                                    {tender.winner_name || 'לא זמין'}
                                                </p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3">
                                                <p className="text-slate-400 text-xs mb-1">יחידות דיור</p>
                                                <p className="text-white text-sm font-medium">
                                                    {formatNumber(tender.units)}
                                                </p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3">
                                                <p className="text-slate-400 text-xs mb-1">שטח (מ"ר)</p>
                                                <p className="text-white text-sm font-medium">
                                                    {formatNumber(tender.area_sqm)}
                                                </p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3">
                                                <p className="text-slate-400 text-xs mb-1">מחיר למ"ר</p>
                                                <p className="text-white text-sm font-medium">
                                                    {formatNumber(pricePerSqm)} ₪
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-slate-800/50 rounded-lg p-3">
                                                <p className="text-slate-400 text-xs mb-1">מחיר שומה</p>
                                                <p className="text-blue-300 text-sm font-medium">
                                                    {tender.appraisal_price > 0 ? formatCurrency(tender.appraisal_price) : 'לא זמין'}
                                                </p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3">
                                                <p className="text-slate-400 text-xs mb-1">פער משומה</p>
                                                <p className={`text-sm font-medium ${discrepancy >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {tender.appraisal_price > 0 ? formatPercent(discrepancy) : 'לא זמין'}
                                                </p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3">
                                                <p className="text-slate-400 text-xs mb-1">עלויות פיתוח</p>
                                                <p className="text-amber-300 text-sm font-medium">
                                                    {formatCurrency(tender.development_costs)}
                                                </p>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3">
                                                <p className="text-slate-400 text-xs mb-1">מספר הצעות</p>
                                                <p className="text-purple-300 text-sm font-medium">
                                                    {tender.bid_count}
                                                </p>
                                            </div>
                                        </div>

                                        {tender.close_date && (
                                            <div className="mt-3 pt-3 border-t border-slate-700">
                                                <p className="text-slate-400 text-xs">
                                                    תאריך סגירה: {new Date(tender.close_date).toLocaleDateString('he-IL')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                    >
                        סגור
                    </button>
                </div>
            </div>
        </div>
    );
}
