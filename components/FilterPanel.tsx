'use client';

import React from 'react';

interface FilterPanelProps {
    filters: {
        city: string;
        tenderId: string;
        minPrice: number;
        maxPrice: number;
        minDiscrepancy: number;
        maxDiscrepancy: number;
        minBids: number;
        maxBids: number;
    };
    onFilterChange: (filters: any) => void;
    stats: {
        minWinningPrice: number;
        maxWinningPrice: number;
        minDiscrepancy: number;
        maxDiscrepancy: number;
        minBidCount: number;
        maxBidCount: number;
        cities: string[];
        tenderIds: string[];
    };
}

export default function FilterPanel({ filters, onFilterChange, stats }: FilterPanelProps) {
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, city: e.target.value });
    };

    const handleTenderIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, tenderId: e.target.value });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (e.target.name === 'minPrice') {
            onFilterChange({ ...filters, minPrice: value });
        } else {
            onFilterChange({ ...filters, maxPrice: value });
        }
    };

    const handleDiscrepancyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (e.target.name === 'minDiscrepancy') {
            onFilterChange({ ...filters, minDiscrepancy: value });
        } else {
            onFilterChange({ ...filters, maxDiscrepancy: value });
        }
    };

    const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (e.target.name === 'minBids') {
            onFilterChange({ ...filters, minBids: value });
        } else {
            onFilterChange({ ...filters, maxBids: value });
        }
    };

    const resetFilters = () => {
        onFilterChange({
            city: '',
            tenderId: '',
            minPrice: stats.minWinningPrice,
            maxPrice: stats.maxWinningPrice,
            minDiscrepancy: stats.minDiscrepancy,
            maxDiscrepancy: stats.maxDiscrepancy,
            minBids: stats.minBidCount,
            maxBids: stats.maxBidCount,
        });
    };

    return (
        <div className="glass-card rounded-2xl p-6 mb-6 border border-slate-600">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-xl">🔍</span>
                    סינון נתונים מתקדם
                </h2>
                <button
                    onClick={resetFilters}
                    className="text-sm text-slate-300 hover:text-white px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                    איפוס סינון
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* City Filter */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">עיר</label>
                    <select
                        value={filters.city}
                        onChange={handleCityChange}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">כל הערים</option>
                        {stats.cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                {/* Tender ID Filter */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">מספר מכרז</label>
                    <select
                        value={filters.tenderId}
                        onChange={handleTenderIdChange}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">כל המכרזים</option>
                        {stats.tenderIds.map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range Filter */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">
                        טווח מחיר זכייה: {filters.minPrice.toLocaleString('he-IL')} - {filters.maxPrice.toLocaleString('he-IL')} ₪
                    </label>
                    <div className="space-y-2">
                        <input
                            type="range"
                            name="minPrice"
                            min={stats.minWinningPrice}
                            max={stats.maxWinningPrice}
                            value={filters.minPrice}
                            onChange={handlePriceChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="range"
                            name="maxPrice"
                            min={stats.minWinningPrice}
                            max={stats.maxWinningPrice}
                            value={filters.maxPrice}
                            onChange={handlePriceChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Discrepancy Range Filter */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">
                        טווח פער משומה: {filters.minDiscrepancy}% - {filters.maxDiscrepancy}%
                    </label>
                    <div className="space-y-2">
                        <input
                            type="range"
                            name="minDiscrepancy"
                            min={stats.minDiscrepancy}
                            max={stats.maxDiscrepancy}
                            value={filters.minDiscrepancy}
                            onChange={handleDiscrepancyChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="range"
                            name="maxDiscrepancy"
                            min={stats.minDiscrepancy}
                            max={stats.maxDiscrepancy}
                            value={filters.maxDiscrepancy}
                            onChange={handleDiscrepancyChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Bid Count Filter */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">
                        טווח הצעות: {filters.minBids} - {filters.maxBids}
                    </label>
                    <div className="space-y-2">
                        <input
                            type="range"
                            name="minBids"
                            min={stats.minBidCount}
                            max={stats.maxBidCount}
                            value={filters.minBids}
                            onChange={handleBidChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="range"
                            name="maxBids"
                            min={stats.minBidCount}
                            max={stats.maxBidCount}
                            value={filters.maxBids}
                            onChange={handleBidChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex flex-wrap gap-2">
                    <div className="text-xs text-slate-400">
                        <span className="text-slate-300">סינון פעיל:</span>
                        {filters.city && ` עיר: ${filters.city}`}
                        {filters.tenderId && ` מכרז: ${filters.tenderId}`}
                        {filters.minPrice > stats.minWinningPrice && ` מחיר מינימום: ${filters.minPrice.toLocaleString('he-IL')} ₪`}
                        {filters.maxPrice < stats.maxWinningPrice && ` מחיר מקסימום: ${filters.maxPrice.toLocaleString('he-IL')} ₪`}
                        {!filters.city && !filters.tenderId && filters.minPrice === stats.minWinningPrice && filters.maxPrice === stats.maxWinningPrice && 
                         filters.minDiscrepancy === stats.minDiscrepancy && filters.maxDiscrepancy === stats.maxDiscrepancy &&
                         filters.minBids === stats.minBidCount && filters.maxBids === stats.maxBidCount && 
                         ' אין סינון'}
                    </div>
                </div>
            </div>
        </div>
    );
}
