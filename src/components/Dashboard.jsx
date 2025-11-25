import { useState } from 'react';
import { useStore } from '../lib/store';
import { Timeline } from './Timeline';
import { CampaignEditor } from './CampaignEditor';
import { Toast } from './Toast';

export function Dashboard() {
    const { buckets, selectCampaign, selectedCampaignId, saveScenario, loadScenario } = useStore();
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    // Open editor when a campaign is selected
    if (selectedCampaignId && !isEditorOpen) {
        setIsEditorOpen(true);
    }

    // Calculate totals for the summary cards
    const totalRevenue = buckets.reduce((sum, b) => sum + b.revenue.iap + b.revenue.ad, 0);
    const totalSpend = buckets.reduce((sum, b) => sum + b.costs.uaSpend, 0);
    const totalProfit = totalRevenue - totalSpend;

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

            {/* Timeline */}
            <Timeline />

            {/* Granular Grid View (Preview) */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#27272a] overflow-hidden">
                <div className="p-4 border-b border-[#27272a]">
                    <h3 className="text-xl font-bold text-white">Daily P&L Buckets</h3>
                </div>
                <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#27272a] text-gray-200 sticky top-0">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Installs</th>
                                <th className="p-3">DAU</th>
                                <th className="p-3">UA Spend</th>
                                <th className="p-3">IAP Rev</th>
                                <th className="p-3">Ad Rev</th>
                                <th className="p-3">Total Rev</th>
                                <th className="p-3">Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272a]">
                            {buckets.slice(0, 30).map((bucket) => {
                                const totalRev = bucket.revenue.iap + bucket.revenue.ad;
                                const profit = totalRev - bucket.costs.uaSpend;
                                return (
                                    <tr key={bucket.date} className="hover:bg-[#27272a]/50 transition-colors">
                                        <td className="p-3 font-mono text-white">{bucket.date}</td>
                                        <td className="p-3">{bucket.metrics.installs}</td>
                                        <td className="p-3">{bucket.metrics.dau}</td>
                                        <td className="p-3 text-red-400">${bucket.costs.uaSpend.toFixed(0)}</td>
                                        <td className="p-3">${bucket.revenue.iap.toFixed(0)}</td>
                                        <td className="p-3">${bucket.revenue.ad.toFixed(0)}</td>
                                        <td className="p-3 text-emerald-400">${totalRev.toFixed(0)}</td>
                                        <td className={`p-3 font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            ${profit.toFixed(0)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
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
