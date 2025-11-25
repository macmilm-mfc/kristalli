import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { getLinearPath, getCatmullRomPath, getMonotoneCubicPath } from '../lib/curveUtils';

export function ROASChart({ points, smoothingMethod, onPointUpdate }) {
    const containerRef = useRef(null);

    // Chart dimensions
    const width = 800;
    const height = 400;
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Scales
    // X-axis: We map the specific days to evenly spaced points or linear scale?
    // The user said "These nodes will not be ay uniform points along teh X axis."
    // But for the UI, if we use linear scale, D720 will be far away.
    // Let's use a non-linear scale where each point gets equal width for better visibility of early days.
    // Or maybe a log scale?
    // "Each of the nodes starts at zero and we can drag it interactively"
    // Let's stick to equal spacing for the nodes on the X axis for now to make them all accessible,
    // but label them correctly. This is a common pattern in such tools.

    const xScale = (index) => (index / (points.length - 1)) * chartWidth;
    const yScale = (value) => chartHeight - (value / 200) * chartHeight; // 0-200% range
    const yToValue = (y) => ((chartHeight - y) / chartHeight) * 200;

    // Generate path data
    const pathData = useMemo(() => {
        const chartPoints = points.map((p, i) => ({
            x: xScale(i),
            y: yScale(p.value)
        }));

        if (smoothingMethod === 'linear') return getLinearPath(chartPoints);
        if (smoothingMethod === 'catmull') return getCatmullRomPath(chartPoints);
        return getMonotoneCubicPath(chartPoints);
    }, [points, smoothingMethod]);

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#27272a]">
            <div className="relative" style={{ width, height }}>
                <svg width={width} height={height} className="overflow-visible">
                    {/* Grid Lines */}
                    {/* Y-axis grid (0%, 50%, 100%, 150%, 200%) */}
                    {[0, 50, 100, 150, 200].map(val => (
                        <g key={val}>
                            <line
                                x1={padding.left}
                                y1={padding.top + yScale(val)}
                                x2={width - padding.right}
                                y2={padding.top + yScale(val)}
                                stroke="#3f3f46"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={padding.left - 10}
                                y={padding.top + yScale(val)}
                                fill="#9ca3af"
                                fontSize="12"
                                textAnchor="end"
                                alignmentBaseline="middle"
                            >
                                {val}%
                            </text>
                        </g>
                    ))}

                    {/* X-axis labels */}
                    {points.map((p, i) => (
                        <text
                            key={p.day}
                            x={padding.left + xScale(i)}
                            y={height - 10}
                            fill="#9ca3af"
                            fontSize="12"
                            textAnchor="middle"
                        >
                            D{p.day}
                        </text>
                    ))}

                    {/* The Curve */}
                    <path
                        d={pathData}
                        transform={`translate(${padding.left}, ${padding.top})`}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Draggable Nodes */}
                {points.map((p, i) => (
                    <motion.div
                        key={p.day}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: chartHeight }}
                        dragElastic={0}
                        dragMomentum={false}
                        onDrag={(event, info) => {
                            // Calculate new value based on Y position
                            // We need to account for the container offset
                            const rect = containerRef.current.getBoundingClientRect();
                            const relativeY = info.point.y - rect.top - padding.top;

                            // Clamp to chart area
                            const clampedY = Math.max(0, Math.min(chartHeight, relativeY));
                            const newValue = yToValue(clampedY);

                            onPointUpdate(p.day, Math.max(0, Math.min(200, newValue)));
                        }}
                        className="absolute w-4 h-4 bg-white rounded-full shadow-lg cursor-ns-resize border-2 border-[#6366f1] hover:scale-125 transition-transform"
                        style={{
                            left: padding.left + xScale(i) - 8, // Center the node
                            top: padding.top + yScale(p.value) - 8,
                        }}
                    />
                ))}

                {/* Invisible container for drag reference */}
                <div
                    ref={containerRef}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        top: 0,
                        left: 0,
                        width,
                        height
                    }}
                />
            </div>
        </div>
    );
}
