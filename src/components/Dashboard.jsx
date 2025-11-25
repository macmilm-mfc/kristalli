import { useState } from 'react';
import { useStore } from '../lib/store';
import { CampaignEditor } from './CampaignEditor';
import { Toast } from './Toast';
import { Tabs } from './Tabs';
import { CampaignPlanner } from './CampaignPlanner';
import { AnalyticsView } from './AnalyticsView';
import { DataView } from './DataView';

export function Dashboard() {
    const { buckets, selectCampaign, selectedCampaignId, saveScenario, loadScenario } = useStore();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('planner');

    // Open editor when a campaign is selected
    if (selectedCampaignId && !isEditorOpen) {
        setIsEditorOpen(true);
    }

    // Calculate totals for the summary cards
    const totalRevenue = buckets.reduce((sum, b) => sum + b.revenue.iap + b.revenue.ad, 0);
    const totalSpend = buckets.reduce((sum, b) => sum + b.costs.uaSpend, 0);
    const totalProfit = totalRevenue - totalSpend;

    const tabs = [
        { id: 'planner', label: 'Campaign Planner' },
        { id: 'analytics', label: 'Analytics Graph' },
        { id: 'data', label: 'Raw Data' },
    ];

    return (
        <div className="container mx-auto py-8 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gradient mb-2">Kristalli Dashboard</h1>
                    <p className="text-gray-400">Financial Modeling Environment</p>
                </div>
                <button
                    onClick={() => {
                        selectCampaign(null);
                        setIsEditorOpen(true);
                    }}
                    className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                    + New Campaign
                </button>
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={saveScenario}
                        className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-3 rounded-lg font-medium transition-colors border border-[#3f3f46]"
                    >
                        Save
                    </button>
                    <button
                        onClick={loadScenario}
                        className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-3 rounded-lg font-medium transition-colors border border-[#3f3f46]"
                    >
                        Load
                    </button>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#27272a]">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Projected Revenue</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                        ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                </div>
                <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#27272a]">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">UA Spend</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                        ${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                </div>
                <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#27272a]">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Net Profit</h3>
                    <p className={`text-3xl font-bold mt-2 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div>
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="mt-6">
                    {activeTab === 'planner' && <CampaignPlanner />}
                    {activeTab === 'analytics' && <AnalyticsView />}
                    {activeTab === 'data' && <DataView />}
                </div>
            </div>

            {/* Campaign Editor Drawer */}
            {isEditorOpen && (
                <CampaignEditor
                    onClose={() => {
                        setIsEditorOpen(false);
                        selectCampaign(null);
                    }}
                />
            )}

            {/* Toast Notifications */}
            <Toast />
        </div>
    );
}
