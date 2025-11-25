import { useStore } from '../lib/store';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export function AnalyticsView() {
    const { buckets } = useStore();

    // Prepare data for the chart
    const data = buckets.map(bucket => {
        const totalRev = bucket.revenue.iap + bucket.revenue.ad;
        const profit = totalRev - bucket.costs.uaSpend;
        return {
            date: bucket.date,
            revenue: totalRev,
            spend: bucket.costs.uaSpend,
            profit: profit
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1a1a] border border-[#27272a] p-4 rounded-lg shadow-xl">
                    <p className="text-white font-bold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: ${entry.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-[#1a1a1a] rounded-xl border border-[#27272a] p-6 h-[600px]">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Financial Analytics</h3>
                <p className="text-gray-400 text-sm">Revenue vs Spend vs Profit over time</p>
            </div>

            <ResponsiveContainer width="100%" height="90%">
                <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#71717a"
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#71717a"
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Total Revenue"
                        fill="url(#colorRevenue)"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={0.1}
                    />
                    <Bar
                        dataKey="spend"
                        name="UA Spend"
                        barSize={20}
                        fill="#ef4444"
                        opacity={0.8}
                        radius={[4, 4, 0, 0]}
                    />
                    <Line
                        type="monotone"
                        dataKey="profit"
                        name="Net Profit"
                        stroke="#ffffff"
                        strokeWidth={2}
                        dot={false}
                    />

                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
