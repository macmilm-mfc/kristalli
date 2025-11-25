import { create } from 'zustand';
import { Campaign, DailyBucket } from './models';
import { generateDailyBuckets } from './engine';
import { addDays, format } from 'date-fns';

interface AppState {
    campaigns: Campaign[];
    buckets: DailyBucket[];
    selectedCampaignId: string | null;
    toast: {
        visible: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    };
    addCampaign: (campaign: Campaign) => void;
    updateCampaign: (id: string, updates: Partial<Campaign>) => void;
    removeCampaign: (id: string) => void;
    duplicateCampaign: (id: string) => void;
    selectCampaign: (id: string | null) => void;
    recalculate: () => void;
    saveScenario: () => void;
    loadScenario: () => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    hideToast: () => void;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
    {
        id: '1',
        name: 'Launch Campaign US',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        dailyBudget: 1000,
        targetCpi: 2.5,
        platform: 'ios',
        geo: 'US',
        color: '#6366f1' // Indigo
    },
    {
        id: '2',
        name: 'Android Expansion',
        startDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
        endDate: format(addDays(new Date(), 45), 'yyyy-MM-dd'),
        dailyBudget: 500,
        targetCpi: 1.5,
        platform: 'android',
        geo: 'ROW',
        color: '#10b981' // Emerald
    }
];

export const useStore = create<AppState>((set, get) => ({
    campaigns: INITIAL_CAMPAIGNS,
    buckets: generateDailyBuckets(INITIAL_CAMPAIGNS),
    selectedCampaignId: null,
    toast: {
        visible: false,
        message: '',
        type: 'info'
    },

    addCampaign: (campaign) => {
        set((state) => {
            const newCampaigns = [...state.campaigns, campaign];
            return {
                campaigns: newCampaigns,
                buckets: generateDailyBuckets(newCampaigns)
            };
        });
    },

    updateCampaign: (id, updates) => {
        set((state) => {
            const newCampaigns = state.campaigns.map((c) =>
                c.id === id ? { ...c, ...updates } : c
            );
            return {
                campaigns: newCampaigns,
                buckets: generateDailyBuckets(newCampaigns)
            };
        });
    },

    removeCampaign: (id) => {
        set((state) => {
            const newCampaigns = state.campaigns.filter((c) => c.id !== id);
            return {
                campaigns: newCampaigns,
                buckets: generateDailyBuckets(newCampaigns),
                selectedCampaignId: state.selectedCampaignId === id ? null : state.selectedCampaignId
            };
        });
    },

    selectCampaign: (id) => set({ selectedCampaignId: id }),

    duplicateCampaign: (id) => {
        const state = get();
        const campaign = state.campaigns.find(c => c.id === id);
        if (campaign) {
            const newCampaign = {
                ...campaign,
                id: crypto.randomUUID(),
                name: `Copy of ${campaign.name}`
            };
            const newCampaigns = [...state.campaigns, newCampaign];
            set({
                campaigns: newCampaigns,
                buckets: generateDailyBuckets(newCampaigns)
            });
            get().showToast('Campaign duplicated successfully', 'success');
        }
    },

    recalculate: () => {
        set((state) => ({
            buckets: generateDailyBuckets(state.campaigns)
        }));
    },

    saveScenario: () => {
        const state = get();
        localStorage.setItem('kristalli_scenario', JSON.stringify(state.campaigns));
        get().showToast('Scenario saved successfully', 'success');
    },

    loadScenario: () => {
        const saved = localStorage.getItem('kristalli_scenario');
        if (saved) {
            const campaigns = JSON.parse(saved);
            set({
                campaigns,
                buckets: generateDailyBuckets(campaigns)
            });
            get().showToast('Scenario loaded successfully', 'success');
        } else {
            get().showToast('No saved scenario found', 'info');
        }
    },

    showToast: (message, type) => {
        set({
            toast: {
                visible: true,
                message,
                type
            }
        });
    },

    hideToast: () => {
        set((state) => ({
            toast: {
                ...state.toast,
                visible: false
            }
        }));
    }
}));
