import { useStore } from '../lib/store';
import { ROASChart } from './ROASChart';

export function ROASBuilder() {
    const { roasCurve, updateRoasPoint, smoothingMethod, setSmoothingMethod } = useStore();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">ROAS Curve Builder</h2>

                <div className="flex items-center gap-4">
                    <label className="text-gray-400 text-sm">Smoothing:</label>
                    <select
                        value={smoothingMethod}
                        onChange={(e) => setSmoothingMethod(e.target.value)}
                        className="bg-[#1a1a1a] border border-[#27272a] text-white rounded-lg px-3 py-2 outline-none focus:border-[#6366f1]"
                    >
                        <option value="linear">Linear</option>
                        <option value="catmull">Smooth (Catmull-Rom)</option>
                        <option value="monotone">Monotone Cubic</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Chart Section */}
                <div className="flex-1 overflow-x-auto">
                    <ROASChart
                        points={roasCurve}
                        smoothingMethod={smoothingMethod}
                        onPointUpdate={updateRoasPoint}
                    />
                </div>

                {/* Manual Input Section */}
                <div className="w-full lg:w-64 space-y-4">
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#27272a] p-4">
                        <h3 className="text-white font-medium mb-4">Data Points</h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {roasCurve.map((point) => (
                                <div key={point.day} className="flex items-center justify-between group">
                                    <label className="text-gray-400 text-sm font-mono w-12">
                                        D{point.day}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={point.value}
                                            onChange={(e) => updateRoasPoint(point.day, parseFloat(e.target.value))}
                                            className="w-20 bg-[#27272a] text-white text-right rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#6366f1]"
                                            step="0.1"
                                            min="0"
                                            max="200"
                                        />
                                        <span className="text-gray-500 text-sm w-4">%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] rounded-xl border border-[#27272a] p-4">
                        <h3 className="text-white font-medium mb-2">Instructions</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Drag the nodes on the chart or enter values manually to define your ROAS curve.
                            This curve will determine the revenue projection for your campaigns.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
