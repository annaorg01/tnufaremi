'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SummaryCard, Icons } from '@/components/SummaryCard';
import { DiscrepancyChart } from '@/components/DiscrepancyChart';
import { DemandHeatmap } from '@/components/DemandHeatmap';
import { DeveloperTable } from '@/components/DeveloperTable';
import { MoneyLeftTable } from '@/components/MoneyLeftTable';
import { StatsPanel } from '@/components/StatsPanel';
import { CityTable } from '@/components/CityTable';
import { HelpGuide, HelpButton } from '@/components/HelpGuide';
import FilterPanel from '@/components/FilterPanel';
import PriceGapSlider from '@/components/PriceGapSlider';
import ChatBot, { ChatBotButton } from '@/components/ChatBot';
import CityDetailModal from '@/components/CityDetailModal';
import DeveloperDetailModal from '@/components/DeveloperDetailModal';
import {
    parseCSVData,
    calculateStats,
    formatCurrency,
    formatNumber,
    formatPercent,
    AggregatedStats,
    TenderRecord
} from '@/lib/data';

export default function Dashboard() {
    const [stats, setStats] = useState<AggregatedStats | null>(null);
    const [rawRecords, setRawRecords] = useState<TenderRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [filters, setFilters] = useState({
        city: '',
        tenderId: '',
        minPrice: 0,
        maxPrice: 0,
        minDiscrepancy: -100,
        maxDiscrepancy: 100,
        minBids: 0,
        maxBids: 0,
    });
    const [showChatBot, setShowChatBot] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [cityTenders, setCityTenders] = useState<TenderRecord[]>([]);
    const [selectedDeveloper, setSelectedDeveloper] = useState<string | null>(null);
    const [developerTenders, setDeveloperTenders] = useState<TenderRecord[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/data/tenders.csv');
                if (!response.ok) {
                    throw new Error('Failed to load data');
                }
                const csvText = await response.text();
                const records = parseCSVData(csvText);
                setRawRecords(records);
                const calculatedStats = calculateStats(records);
                setStats(calculatedStats);
                
                // Initialize filters with min/max values
                const winningPrices = records.filter(r => r.winning_price > 0).map(r => r.winning_price);
                const discrepancies = records
                    .filter(r => r.appraisal_price > 0)
                    .map(r => ((r.winning_price - r.appraisal_price) / r.appraisal_price) * 100)
                    .filter(d => Math.abs(d) < 1000);
                const bidCounts = records.map(r => r.bid_count);
                
                setFilters(prev => ({
                    ...prev,
                    minPrice: Math.min(...winningPrices),
                    maxPrice: Math.max(...winningPrices),
                    minDiscrepancy: Math.min(...discrepancies),
                    maxDiscrepancy: Math.max(...discrepancies),
                    minBids: Math.min(...bidCounts),
                    maxBids: Math.max(...bidCounts),
                }));
            } catch (err) {
                console.error('Error loading data:', err);
                setError('שגיאה בטעינת הנתונים');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Calculate filtered stats - MUST be before any conditional returns
    const filteredStats = useMemo(() => {
        if (!stats) return null;
        
        // For now, return the full stats (filtering logic would go here)
        // In a real implementation, you would filter rawRecords based on filters
        // and recalculate stats
        return stats;
    }, [stats, filters, rawRecords]);

    // Get unique cities for filter dropdown - MUST be before any conditional returns
    const uniqueCities = useMemo(() => {
        const cities = rawRecords.map(r => r.city.split(',')[0].trim()).filter(Boolean);
        return Array.from(new Set(cities)).sort();
    }, [rawRecords]);

    // Get unique tender IDs for filter dropdown
    const uniqueTenderIds = useMemo(() => {
        const ids = rawRecords.map(r => r.tender_number).filter(Boolean);
        return Array.from(new Set(ids)).sort();
    }, [rawRecords]);

    const filterStats = useMemo(() => ({
        minWinningPrice: filters.minPrice,
        maxWinningPrice: filters.maxPrice,
        minDiscrepancy: filters.minDiscrepancy,
        maxDiscrepancy: filters.maxDiscrepancy,
        minBidCount: filters.minBids,
        maxBidCount: filters.maxBids,
        cities: uniqueCities,
        tenderIds: uniqueTenderIds,
    }), [filters, uniqueCities, uniqueTenderIds]);

    // Early returns for loading and error states
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300">טוען נתונים...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center glass-card p-8 rounded-2xl">
                    <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-rose-400 font-medium">{error || 'שגיאה בטעינת הנתונים'}</p>
                </div>
            </div>
        );
    }

    const noBidsRate = ((stats.tendersWithNoBids / stats.totalRecords) * 100).toFixed(1);
    const competitiveRate = (((stats.totalRecords - stats.tendersWithNoBids - stats.tendersWithOneBid) / stats.totalRecords) * 100).toFixed(1);

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} />
            <ChatBot isOpen={showChatBot} onClose={() => setShowChatBot(false)} />
            {!showChatBot && <ChatBotButton onClick={() => setShowChatBot(true)} />}

            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                            לוח בקרה מכרזים בריטניה
                        </h1>
                        <p className="text-slate-300">
                            ניתוח מכרזי קרקע | זיהוי הזדמנויות | מעקב ביצועים
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <HelpButton onClick={() => setShowHelp(true)} />
                        <div className="glass-card px-4 py-2 rounded-xl text-sm text-slate-300">
                            {stats.totalRecords} מתחמים | {new Date().toLocaleDateString('he-IL')}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mayor's Key Insights Banner */}
            <div className="glass-card rounded-2xl p-6 mb-8 border border-blue-500/40">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    תובנות מפתח עסקיות
                    <span className="text-xs text-slate-400 font-normal mr-2">(לחץ על כל קופסה לפרטים)</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/40 hover:border-emerald-400 transition-colors cursor-pointer">
                        <p className="text-emerald-300 text-sm font-medium mb-1">💰 הכנסות לרמ"י</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-slate-300 text-xs mt-1">סה״כ תשלומי יזמים עבור קרקע</p>
                    </div>
                    <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/40 hover:border-blue-400 transition-colors cursor-pointer">
                        <p className="text-blue-300 text-sm font-medium mb-1">🏗️ השקעה בתשתיות</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalDevelopmentCosts)}</p>
                        <p className="text-slate-300 text-xs mt-1">משולם ע״י היזמים, לא העירייה!</p>
                    </div>
                    <div className={`rounded-xl p-4 border transition-colors cursor-pointer ${parseFloat(noBidsRate) > 20
                            ? 'bg-rose-500/20 border-rose-500/40 hover:border-rose-400'
                            : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
                        }`}>
                        <p className={`text-sm font-medium mb-1 ${parseFloat(noBidsRate) > 20 ? 'text-rose-300' : 'text-slate-300'}`}>
                            ❄️ ללא הצעות
                        </p>
                        <p className="text-2xl font-bold text-white">{noBidsRate}%</p>
                        <p className="text-slate-300 text-xs mt-1">{stats.tendersWithNoBids} מתחמים לבחינה</p>
                    </div>
                    <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/40 hover:border-purple-400 transition-colors cursor-pointer">
                        <p className="text-purple-300 text-sm font-medium mb-1">🏆 תחרות בריאה</p>
                        <p className="text-2xl font-bold text-white">{competitiveRate}%</p>
                        <p className="text-slate-300 text-xs mt-1">מכרזים עם 2+ הצעות</p>
                    </div>
                </div>
            </div>

            {/* Filter Panel - NEW */}
            <FilterPanel 
                filters={filters}
                onFilterChange={setFilters}
                stats={filterStats}
            />

            {/* Price Gap Slider - NEW */}
            <PriceGapSlider data={stats.anomalies} />

            {/* Summary Cards Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                    title="מחיר זכייה חציון"
                    value={formatCurrency(stats.medianWinningPrice)}
                    subtitle={`ממוצע: ${formatCurrency(stats.avgWinningPrice)}`}
                    icon={Icons.revenue}
                    explanation="החציון הוא הערך האמצעי - חצי מהמכרזים מעליו וחצי מתחתיו. יותר מייצג מממוצע כי לא מושפע מערכים קיצוניים."
                />
                <SummaryCard
                    title="פער חציון משומה"
                    value={formatPercent(stats.medianDiscrepancy)}
                    subtitle={`ממוצע: ${formatPercent(stats.avgDiscrepancy)}`}
                    icon={Icons.percent}
                    explanation="כמה אחוזים יזמים משלמים מעל/מתחת להערכת השמאי הממשלתי. חיובי = ביקוש גבוה, שלילי = בעיות אפשריות."
                    trend={stats.medianDiscrepancy > 0 ? 'יזמים משלמים מעל' : 'מתחת לשומה'}
                    trendPositive={stats.medianDiscrepancy > 0}
                />
                <SummaryCard
                    title="יחידות דיור מתוכננות"
                    value={formatNumber(stats.totalUnits)}
                    subtitle={`${formatNumber(stats.totalArea)} מ״ר`}
                    icon={Icons.tenders}
                    explanation="סה״כ דירות שיבנו בכל המכרזים. מייצג את היקף הבנייה הצפוי."
                />
                <SummaryCard
                    title="שכונה הכי מבוקשת"
                    value={stats.mostPopularNeighborhood}
                    subtitle="לפי יחס הצעות ליחידה"
                    icon={Icons.location}
                    explanation="השכונה עם הכי הרבה הצעות ביחס לגודל. מעידה על ביקוש גבוה - אולי כדאי להקצות שם עוד קרקעות."
                />
            </div>

            {/* Summary Cards Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <SummaryCard
                    title="הצעות לכל מכרז (חציון)"
                    value={stats.medianBidCount.toFixed(0)}
                    subtitle={`שיא: ${stats.maxBidCount} הצעות`}
                    icon={Icons.percent}
                    explanation="כמה יזמים מתחרים על כל מכרז בממוצע. יותר = תחרות בריאה ומחירים טובים יותר."
                />
                <SummaryCard
                    title="מחיר חציון למ״ר"
                    value={`${formatNumber(stats.medianPricePerSqm)} ₪`}
                    subtitle={`ממוצע: ${formatNumber(stats.avgPricePerSqm)} ₪`}
                    icon={Icons.revenue}
                    explanation="מאפשר השוואה הוגנת בין מכרזים בגדלים שונים. מחיר גבוה = אזור יקר ומבוקש."
                />
                <SummaryCard
                    title="מכרזים שהצליחו"
                    value={`${stats.totalTenders}`}
                    subtitle={`מתוך ${stats.totalRecords} מתחמים`}
                    icon={Icons.tenders}
                    explanation="כמה מכרזים הסתיימו בזכייה. היתר לא קיבלו הצעות או נדחו מסיבות שונות."
                />
                <SummaryCard
                    title="פיזור הצעות"
                    value={formatPercent(stats.avgBidSpread)}
                    subtitle="פער בין גבוהה לנמוכה"
                    icon={Icons.percent}
                    explanation="כמה רחוקות ההצעות זו מזו. פיזור גדול = יזמים מעריכים את הקרקע אחרת."
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <DiscrepancyChart data={stats.anomalies} />
                <DemandHeatmap data={stats.neighborhoodDemand} />
            </div>

            {/* Stats + Cities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <StatsPanel stats={stats} />
                <CityTable 
                    data={stats.cityStats} 
                    onCityClick={(cityName) => {
                        const cityRecords = rawRecords.filter(r => {
                            const recordCity = r.city.split(',')[0].trim();
                            return recordCity === cityName && r.winning_price > 0;
                        });
                        setCityTenders(cityRecords);
                        setSelectedCity(cityName);
                    }}
                />
            </div>

            {/* City Detail Modal */}
            <CityDetailModal
                isOpen={selectedCity !== null}
                onClose={() => {
                    setSelectedCity(null);
                    setCityTenders([]);
                }}
                cityName={selectedCity || ''}
                tenders={cityTenders}
            />

            {/* Developer Info */}
            <div className="glass-card rounded-2xl p-6 mb-8 border border-amber-500/40">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    חשוב לדעת: עלויות הפיתוח
                </h2>
                <div className="flex flex-wrap gap-6">
                    <div className="flex-1 min-w-64">
                        <p className="text-slate-200 text-sm leading-relaxed">
                            עלויות הפיתוח (תשתיות, כבישים, ביוב, חשמל) <strong className="text-amber-400">משולמות על ידי היזמים הזוכים</strong>,
                            לא על ידי העירייה. העיר מקבלת תשתיות חדשות ללא עלות ישירה.
                        </p>
                    </div>
                    <div className="bg-amber-500/20 rounded-lg px-6 py-3 border border-amber-500/40">
                        <p className="text-amber-300 text-xs">סה״כ השקעה בתשתיות</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalDevelopmentCosts)}</p>
                    </div>
                </div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DeveloperTable 
                    data={stats.topDevelopers}
                    onDeveloperClick={(developerName) => {
                        const devRecords = rawRecords.filter(r => {
                            return r.winner_name === developerName && r.winning_price > 0;
                        });
                        setDeveloperTenders(devRecords);
                        setSelectedDeveloper(developerName);
                    }}
                />
                <MoneyLeftTable data={stats.moneyLeftOnTable} />
            </div>

            {/* Developer Detail Modal */}
            <DeveloperDetailModal
                isOpen={selectedDeveloper !== null}
                onClose={() => {
                    setSelectedDeveloper(null);
                    setDeveloperTenders([]);
                }}
                developerName={selectedDeveloper || ''}
                tenders={developerTenders}
            />

            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
                <p className="text-slate-300">לוח בקרה מכרזים בריטניה | ניתוח מכרזי קרקע רמ"י</p>
                <p className="mt-2 text-xs">
                    הכנסות: {formatCurrency(stats.totalRevenue)} |
                    תשתיות: {formatCurrency(stats.totalDevelopmentCosts)} |
                    {stats.totalTenders} זוכים מתוך {stats.totalRecords}
                </p>
                <button
                    onClick={() => setShowHelp(true)}
                    className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                    📖 מדריך מלא והסברים
                </button>
            </footer>
        </div>
    );
}
