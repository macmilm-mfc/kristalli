import { addDays, differenceInDays, format, parseISO, startOfDay, isWithinInterval } from 'date-fns';
import { Campaign, DailyBucket, Cohort } from './models';

// Helper to create an empty bucket
const createEmptyBucket = (date: string): DailyBucket => ({
    date,
    revenue: { iap: 0, ad: 0, subscription: 0 },
    costs: { uaSpend: 0, platformFees: 0 },
    metrics: { dau: 0, installs: 0, arppu: 0 },
});

// Mock curves for Phase 1
const MOCK_RETENTION = [1.0, 0.6, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05]; // 9 days
const MOCK_ARPU_CUMULATIVE = [0.5, 0.8, 1.0, 1.2, 1.4, 1.5, 1.6, 1.7, 1.8]; // 9 days

export const generateDailyBuckets = (campaigns: Campaign[], forecastDays = 365): DailyBucket[] => {
    const buckets: Record<string, DailyBucket> = {};
    const today = startOfDay(new Date());

    // Initialize buckets for the forecast period
    for (let i = 0; i < forecastDays; i++) {
        const dateStr = format(addDays(today, i), 'yyyy-MM-dd');
        buckets[dateStr] = createEmptyBucket(dateStr);
    }

    campaigns.forEach(campaign => {
        const start = parseISO(campaign.startDate);
        const end = parseISO(campaign.endDate);

        // Iterate through each day of the campaign to generate cohorts
        let current = start;
        while (current <= end) {
            const dateStr = format(current, 'yyyy-MM-dd');

            // If campaign day is within forecast range
            if (buckets[dateStr]) {
                // 1. Calculate UA Spend & Installs for this day (The Cohort Acquisition Day)
                const installs = Math.floor(campaign.dailyBudget / campaign.targetCpi);

                buckets[dateStr].costs.uaSpend += campaign.dailyBudget;
                buckets[dateStr].metrics.installs += installs;

                // 2. Project Cohort Performance forward
                // For each day after acquisition, calculate revenue and retained users
                MOCK_RETENTION.forEach((retentionRate, dayIndex) => {
                    const projectionDate = addDays(current, dayIndex);
                    const projectionDateStr = format(projectionDate, 'yyyy-MM-dd');

                    if (buckets[projectionDateStr]) {
                        const activeUsers = Math.floor(installs * retentionRate);
                        buckets[projectionDateStr].metrics.dau += activeUsers;

                        // Revenue Calculation (Incremental ARPU)
                        const cumulativeArpuNow = MOCK_ARPU_CUMULATIVE[dayIndex] || MOCK_ARPU_CUMULATIVE[MOCK_ARPU_CUMULATIVE.length - 1];
                        const cumulativeArpuPrev = dayIndex > 0 ? (MOCK_ARPU_CUMULATIVE[dayIndex - 1] || MOCK_ARPU_CUMULATIVE[MOCK_ARPU_CUMULATIVE.length - 1]) : 0;
                        const dailyArpu = cumulativeArpuNow - cumulativeArpuPrev;

                        const dailyRevenue = activeUsers * dailyArpu;

                        // Split revenue arbitrarily for Phase 1 mock
                        buckets[projectionDateStr].revenue.iap += dailyRevenue * 0.7;
                        buckets[projectionDateStr].revenue.ad += dailyRevenue * 0.3;

                        // Platform fees (30% of IAP)
                        buckets[projectionDateStr].costs.platformFees += (dailyRevenue * 0.7) * 0.3;
                    }
                });
            }
            current = addDays(current, 1);
        }
    });

    return Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
};
