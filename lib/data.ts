// Data types for tender dashboard
export interface TenderRecord {
    tender_id: string;
    tender_number: string;
    city: string;
    neighborhood: string;
    total_units: number;
    publish_date: string;
    open_date: string;
    close_date: string;
    committee_date: string;
    compound_number: string;
    units: number;
    area_sqm: number;
    winner_name: string;
    winning_price: number;
    appraisal_price: number;
    development_costs: number;
    bid_count: number;
    all_bids: string;
    min_price: string;
}

// Extended stats with median, percentiles, and more
export interface AggregatedStats {
    // Basic metrics
    totalRevenue: number;
    totalTenders: number;
    totalRecords: number;
    totalUnits: number;
    totalArea: number;

    // Discrepancy stats
    avgDiscrepancy: number;
    medianDiscrepancy: number;
    discrepancyP25: number;
    discrepancyP75: number;

    // Price stats
    avgWinningPrice: number;
    medianWinningPrice: number;
    minWinningPrice: number;
    maxWinningPrice: number;

    // Price per sqm
    avgPricePerSqm: number;
    medianPricePerSqm: number;

    // Bid stats
    avgBidCount: number;
    medianBidCount: number;
    maxBidCount: number;
    tendersWithNoBids: number;
    tendersWithOneBid: number;

    // Competition stats
    avgBidSpread: number; // avg difference between highest and lowest bid
    medianBidSpread: number;

    // Development costs
    totalDevelopmentCosts: number;
    avgDevelopmentCosts: number;

    // City breakdown
    cityStats: CityStats[];

    // Existing
    mostPopularNeighborhood: string;
    topDevelopers: DeveloperStats[];
    neighborhoodDemand: NeighborhoodStats[];
    anomalies: AnomalyRecord[];
    moneyLeftOnTable: MoneyLeftRecord[];

    // Time analysis
    monthlyRevenue: MonthlyData[];

    // Price distribution
    priceDistribution: PriceRange[];
}

export interface CityStats {
    city: string;
    tenders: number;
    revenue: number;
    avgPrice: number;
    medianPrice: number;
    avgBidCount: number;
    units: number;
}

export interface MonthlyData {
    month: string;
    revenue: number;
    tenders: number;
    avgPrice: number;
}

export interface PriceRange {
    range: string;
    count: number;
    percentage: number;
}

export interface DeveloperStats {
    name: string;
    wins: number;
    totalRevenue: number;
    avgDiscrepancy: number;
    avgPrice: number;
    totalUnits: number;
}

export interface NeighborhoodStats {
    neighborhood: string;
    city: string;
    bidCount: number;
    units: number;
    demandPerUnit: number;
    avgPrice: number;
    tenders: number;
}

export interface AnomalyRecord {
    tender_id: string;
    city: string;
    neighborhood: string;
    winning_price: number;
    appraisal_price: number;
    discrepancy: number;
    discrepancyPercent: number;
    winner_name: string;
}

export interface MoneyLeftRecord {
    tender_id: string;
    city: string;
    neighborhood: string;
    winner_name: string;
    winning_price: number;
    second_bid: number;
    gap: number;
    gapPercent: number;
}

// Statistical helper functions
function median(arr: number[]): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function percentile(arr: number[], p: number): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function average(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Parse the all_bids string to extract bid values
function parseBids(allBidsStr: string): number[] {
    if (!allBidsStr || allBidsStr.trim() === '') return [];

    return allBidsStr
        .split(';')
        .map(bid => {
            const cleaned = bid.trim().replace(/,/g, '');
            const num = parseFloat(cleaned);
            return isNaN(num) ? 0 : num;
        })
        .filter(n => n > 0)
        .sort((a, b) => b - a);
}

// Parse CSV data
export function parseCSVData(csvText: string): TenderRecord[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const records: TenderRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const fields: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                fields.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        fields.push(current.trim());

        if (fields.length >= 22) {
            records.push({
                tender_id: fields[0],
                tender_number: fields[1],
                city: fields[2].replace(/"/g, ''),
                neighborhood: fields[3],
                total_units: parseInt(fields[4]) || 0,
                publish_date: fields[5],
                open_date: fields[6],
                close_date: fields[7],
                committee_date: fields[8],
                compound_number: fields[9],
                units: parseInt(fields[10]) || 0,
                area_sqm: parseInt(fields[11]) || 0,
                winner_name: fields[12].replace(/"/g, ''),
                winning_price: parseInt(fields[13]) || 0,
                appraisal_price: parseInt(fields[14]) || 0,
                development_costs: parseInt(fields[15]) || 0,
                bid_count: parseInt(fields[20]) || 0,
                all_bids: fields[21],
                min_price: fields[23] || '',
            });
        }
    }

    return records;
}

// Calculate comprehensive statistics
export function calculateStats(records: TenderRecord[]): AggregatedStats {
    // Filter valid records
    const validRecords = records.filter(r =>
        r.winning_price > 0 &&
        r.winner_name &&
        !r.winner_name.includes('אין הצעות') &&
        !r.winner_name.includes('הצעות לא תקינות') &&
        !r.winner_name.includes('המציע זכה')
    );

    const allRecords = records;

    // Basic metrics
    const totalRevenue = validRecords.reduce((sum, r) => sum + r.winning_price, 0);
    const totalUnits = validRecords.reduce((sum, r) => sum + r.units, 0);
    const totalArea = validRecords.reduce((sum, r) => sum + r.area_sqm, 0);
    const totalDevelopmentCosts = validRecords.reduce((sum, r) => sum + r.development_costs, 0);

    // Winning price stats
    const winningPrices = validRecords.map(r => r.winning_price);
    const avgWinningPrice = average(winningPrices);
    const medianWinningPrice = median(winningPrices);
    const minWinningPrice = Math.min(...winningPrices);
    const maxWinningPrice = Math.max(...winningPrices);

    // Price per sqm
    const pricesPerSqm = validRecords
        .filter(r => r.area_sqm > 0)
        .map(r => r.winning_price / r.area_sqm);
    const avgPricePerSqm = average(pricesPerSqm);
    const medianPricePerSqm = median(pricesPerSqm);

    // Discrepancy stats (only where appraisal > 0 and reasonable values)
    const recordsWithAppraisal = validRecords.filter(r => r.appraisal_price > 0);
    const discrepancyPercents = recordsWithAppraisal
        .map(r => ((r.winning_price - r.appraisal_price) / r.appraisal_price) * 100)
        .filter(d => Math.abs(d) < 1000); // Filter extreme outliers

    const avgDiscrepancy = average(discrepancyPercents);
    const medianDiscrepancy = median(discrepancyPercents);
    const discrepancyP25 = percentile(discrepancyPercents, 25);
    const discrepancyP75 = percentile(discrepancyPercents, 75);

    // Bid count stats
    const bidCounts = allRecords.map(r => r.bid_count);
    const avgBidCount = average(bidCounts);
    const medianBidCount = median(bidCounts);
    const maxBidCount = Math.max(...bidCounts, 0);
    const tendersWithNoBids = allRecords.filter(r => r.bid_count === 0).length;
    const tendersWithOneBid = allRecords.filter(r => r.bid_count === 1).length;

    // Bid spread (competition measure)
    const bidSpreads = validRecords
        .map(r => {
            const bids = parseBids(r.all_bids);
            if (bids.length < 2) return null;
            return ((bids[0] - bids[bids.length - 1]) / bids[0]) * 100;
        })
        .filter((s): s is number => s !== null);
    const avgBidSpread = average(bidSpreads);
    const medianBidSpread = median(bidSpreads);

    // City stats
    const cityMap = new Map<string, { revenue: number; count: number; prices: number[]; bidCounts: number[]; units: number }>();
    validRecords.forEach(r => {
        const city = r.city.split(',')[0].trim();
        const existing = cityMap.get(city);
        if (existing) {
            existing.revenue += r.winning_price;
            existing.count += 1;
            existing.prices.push(r.winning_price);
            existing.bidCounts.push(r.bid_count);
            existing.units += r.units;
        } else {
            cityMap.set(city, {
                revenue: r.winning_price,
                count: 1,
                prices: [r.winning_price],
                bidCounts: [r.bid_count],
                units: r.units
            });
        }
    });

    const cityStats: CityStats[] = Array.from(cityMap.entries())
        .map(([city, data]) => ({
            city,
            tenders: data.count,
            revenue: data.revenue,
            avgPrice: average(data.prices),
            medianPrice: median(data.prices),
            avgBidCount: average(data.bidCounts),
            units: data.units
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 15);

    // Monthly revenue
    const monthMap = new Map<string, { revenue: number; count: number; prices: number[] }>();
    validRecords.forEach(r => {
        if (r.close_date) {
            const month = r.close_date.substring(0, 7); // YYYY-MM
            const existing = monthMap.get(month);
            if (existing) {
                existing.revenue += r.winning_price;
                existing.count += 1;
                existing.prices.push(r.winning_price);
            } else {
                monthMap.set(month, { revenue: r.winning_price, count: 1, prices: [r.winning_price] });
            }
        }
    });

    const monthlyRevenue: MonthlyData[] = Array.from(monthMap.entries())
        .map(([month, data]) => ({
            month,
            revenue: data.revenue,
            tenders: data.count,
            avgPrice: average(data.prices)
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

    // Price distribution
    const priceRanges = [
        { min: 0, max: 1000000, label: 'עד 1M' },
        { min: 1000000, max: 10000000, label: '1M-10M' },
        { min: 10000000, max: 50000000, label: '10M-50M' },
        { min: 50000000, max: 100000000, label: '50M-100M' },
        { min: 100000000, max: 500000000, label: '100M-500M' },
        { min: 500000000, max: Infinity, label: 'מעל 500M' },
    ];

    const priceDistribution: PriceRange[] = priceRanges.map(range => {
        const count = validRecords.filter(r => r.winning_price >= range.min && r.winning_price < range.max).length;
        return {
            range: range.label,
            count,
            percentage: (count / validRecords.length) * 100
        };
    });

    // Anomalies (filtered for reasonable values)
    const anomalies: AnomalyRecord[] = recordsWithAppraisal
        .map(r => ({
            ...r,
            discrepancy: r.winning_price - r.appraisal_price,
            discrepancyPercent: ((r.winning_price - r.appraisal_price) / r.appraisal_price) * 100
        }))
        .filter(r => Math.abs(r.discrepancyPercent) > 20 && Math.abs(r.discrepancyPercent) < 500) // Limit outliers
        .sort((a, b) => Math.abs(b.discrepancyPercent) - Math.abs(a.discrepancyPercent))
        .slice(0, 10)
        .map(r => ({
            tender_id: r.tender_id,
            city: r.city,
            neighborhood: r.neighborhood,
            winning_price: r.winning_price,
            appraisal_price: r.appraisal_price,
            discrepancy: r.discrepancy,
            discrepancyPercent: r.discrepancyPercent,
            winner_name: r.winner_name
        }));

    // Money left on table
    const moneyLeftOnTable: MoneyLeftRecord[] = validRecords
        .map(r => {
            const bids = parseBids(r.all_bids);
            if (bids.length < 2) return null;
            const gap = bids[0] - bids[1];
            return {
                tender_id: r.tender_id,
                city: r.city,
                neighborhood: r.neighborhood,
                winner_name: r.winner_name,
                winning_price: r.winning_price,
                second_bid: bids[1],
                gap,
                gapPercent: (gap / bids[0]) * 100
            };
        })
        .filter((r): r is MoneyLeftRecord => r !== null && r.gap > 0)
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 10);

    // Neighborhood demand (enhanced)
    const neighborhoodMap = new Map<string, { city: string; bidCount: number; units: number; prices: number[]; count: number }>();
    validRecords.forEach(r => {
        const key = r.neighborhood || r.city;
        const existing = neighborhoodMap.get(key);
        if (existing) {
            existing.bidCount += r.bid_count;
            existing.units += r.units;
            existing.prices.push(r.winning_price);
            existing.count += 1;
        } else {
            neighborhoodMap.set(key, { city: r.city, bidCount: r.bid_count, units: r.units, prices: [r.winning_price], count: 1 });
        }
    });

    const neighborhoodDemand: NeighborhoodStats[] = Array.from(neighborhoodMap.entries())
        .map(([neighborhood, data]) => ({
            neighborhood,
            city: data.city,
            bidCount: data.bidCount,
            units: data.units,
            demandPerUnit: data.units > 0 ? data.bidCount / data.units : 0,
            avgPrice: average(data.prices),
            tenders: data.count
        }))
        .filter(n => n.units > 0)
        .sort((a, b) => b.demandPerUnit - a.demandPerUnit)
        .slice(0, 10);

    const mostPopularNeighborhood = neighborhoodDemand.length > 0 ? neighborhoodDemand[0].neighborhood : 'לא זמין';

    // Developer analysis (enhanced)
    const developerMap = new Map<string, { wins: number; totalRevenue: number; discrepancies: number[]; prices: number[]; units: number }>();
    validRecords.forEach(r => {
        const name = r.winner_name;
        const existing = developerMap.get(name);
        const discrepancy = r.appraisal_price > 0
            ? ((r.winning_price - r.appraisal_price) / r.appraisal_price) * 100
            : 0;

        if (existing) {
            existing.wins += 1;
            existing.totalRevenue += r.winning_price;
            existing.prices.push(r.winning_price);
            existing.units += r.units;
            if (discrepancy !== 0 && Math.abs(discrepancy) < 500) existing.discrepancies.push(discrepancy);
        } else {
            developerMap.set(name, {
                wins: 1,
                totalRevenue: r.winning_price,
                prices: [r.winning_price],
                units: r.units,
                discrepancies: (discrepancy !== 0 && Math.abs(discrepancy) < 500) ? [discrepancy] : []
            });
        }
    });

    const topDevelopers: DeveloperStats[] = Array.from(developerMap.entries())
        .map(([name, data]) => ({
            name,
            wins: data.wins,
            totalRevenue: data.totalRevenue,
            avgDiscrepancy: average(data.discrepancies),
            avgPrice: average(data.prices),
            totalUnits: data.units
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10);

    return {
        totalRevenue,
        totalTenders: validRecords.length,
        totalRecords: allRecords.length,
        totalUnits,
        totalArea,
        avgDiscrepancy,
        medianDiscrepancy,
        discrepancyP25,
        discrepancyP75,
        avgWinningPrice,
        medianWinningPrice,
        minWinningPrice,
        maxWinningPrice,
        avgPricePerSqm,
        medianPricePerSqm,
        avgBidCount,
        medianBidCount,
        maxBidCount,
        tendersWithNoBids,
        tendersWithOneBid,
        avgBidSpread,
        medianBidSpread,
        totalDevelopmentCosts,
        avgDevelopmentCosts: average(validRecords.map(r => r.development_costs)),
        cityStats,
        mostPopularNeighborhood,
        topDevelopers,
        neighborhoodDemand,
        anomalies,
        moneyLeftOnTable,
        monthlyRevenue,
        priceDistribution
    };
}

// Format helpers
export function formatCurrency(value: number): string {
    if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}B ₪`;
    }
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M ₪`;
    }
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

export function formatNumber(value: number): string {
    return new Intl.NumberFormat('he-IL').format(Math.round(value));
}

export function formatPercent(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
