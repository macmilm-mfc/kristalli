import { useMemo, useRef, useState, useEffect } from 'react';
import { getLinearPath, getCatmullRomPath, getMonotoneCubicPath } from '../lib/curveUtils';

export function ROASChart({ points, smoothingMethod, onPointUpdate }) {
    const containerRef = useRef(null);
    const [draggingId, setDraggingId] = useState(null);

    // Chart dimensions
    const width = 800;
    const height = 400;
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const xScale = (index) => {
        if (points.length <= 1) return 0;
        return (index / (points.length - 1)) * chartWidth;
    };

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

    // Handle global pointer move/up when dragging
    useEffect(() => {
        if (draggingId === null) return;

        const handlePointerMove = (e) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const relativeY = e.clientY - rect.top - padding.top;

            // Clamp to chart area
            const clampedY = Math.max(0, Math.min(chartHeight, relativeY));
            const newValue = yToValue(clampedY);

            onPointUpdate(draggingId, Math.max(0, Math.min(200, newValue)));
        };

        const handlePointerUp = () => {
            setDraggingId(null);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [draggingId, chartHeight, onPointUpdate, padding.top, yToValue]);

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#27272a]">
            <div className="relative" style={{ width, height }}>
                <svg width={width} height={height} className="overflow-visible select-none">
                    {/* Grid Lines */}
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
                <div
                    ref={containerRef}
                    className="absolute inset-0"
                    style={{
                        top: 0,
                        left: 0,
                        width,
                        height,
                        pointerEvents: 'none' // Let events pass through to nodes, but used for rect reference
                    }}
                >
                    {points.map((p, i) => (
                        <div
                            key={p.day}
                            onPointerDown={(e) => {
                                e.preventDefault(); // Prevent text selection
                                setDraggingId(p.day);
                            }}
                            className={`absolute w-4 h-4 bg-white rounded-full shadow-lg cursor-ns-resize border-2 border-[#6366f1] transition-transform ${draggingId === p.day ? 'scale-125' : 'hover:scale-125'}`}
                            style={{
                                left: padding.left + xScale(i) - 8,
                                top: padding.top + yScale(p.value) - 8,
                                pointerEvents: 'auto', // Re-enable pointer events for nodes
                                touchAction: 'none' // Prevent scrolling while dragging on touch devices
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
