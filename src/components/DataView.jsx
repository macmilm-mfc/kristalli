import { useStore } from '../lib/store';

export function DataView() {
    const { buckets } = useStore();

    return (
        <div className="bg-[#1a1a1a] rounded-xl border border-[#27272a] overflow-hidden">
            <div className="p-4 border-b border-[#27272a]">
                <h3 className="text-xl font-bold text-white">Daily P&L Buckets</h3>
            </div>
            <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#27272a] text-gray-200 sticky top-0 z-10">
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
                        {buckets.map((bucket) => {
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
    );
}
