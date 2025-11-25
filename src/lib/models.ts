export type Platform = 'ios' | 'android';
export type Geo = 'US' | 'EU' | 'APAC' | 'ROW';

export interface DailyBucket {
    date: string; // ISO date string YYYY-MM-DD
    revenue: {
        iap: number;
        ad: number;
        subscription: number;
    };
    costs: {
        uaSpend: number;
        platformFees: number;
    };
    metrics: {
        dau: number;
        installs: number;
        arppu: number;
    };
}

export interface Cohort {
    id: string;
    date: string; // Acquisition date
    campaignId: string;
    users: number;
    platform: Platform;
    geo: Geo;
    // Simplified retention/monetization for Phase 1
    retentionCurve: number[]; // Day 0 to Day N retention %
    arpuCurve: number[]; // Day 0 to Day N cumulative ARPU
}

export interface Campaign {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    dailyBudget: number;
    targetCpi: number;
    platform: Platform;
    geo: Geo;
    color: string; // For UI visualization
}

export interface Scenario {
    id: string;
    name: string;
    campaigns: Campaign[];
}
