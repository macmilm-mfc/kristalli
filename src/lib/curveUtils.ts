export type Point = { x: number; y: number };

/**
 * Generates a simple linear SVG path command (L) connecting the points.
 */
export function getLinearPath(points: Point[]): string {
    if (points.length === 0) return '';

    const d = points.map((p, i) => {
        return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
    }).join(' ');

    return d;
}

/**
 * Generates a Catmull-Rom spline path.
 * This passes through all points and is smooth.
 * Adapted for SVG path data.
 */
export function getCatmullRomPath(points: Point[], k: number = 1): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? 0 : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2; // Duplicate last point if needed

        const cp1x = p1.x + (p2.x - p0.x) / 6 * k;
        const cp1y = p1.y + (p2.y - p0.y) / 6 * k;

        const cp2x = p2.x - (p3.x - p1.x) / 6 * k;
        const cp2y = p2.y - (p3.y - p1.y) / 6 * k;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
}

/**
 * Generates a Monotone Cubic Spline path.
 * This preserves monotonicity (doesn't overshoot) which is good for ROAS curves
 * that should generally be increasing.
 */
export function getMonotoneCubicPath(points: Point[]): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    // Calculate slopes
    const n = points.length;
    const dxs = [];
    const dys = [];
    const slopes = [];

    for (let i = 0; i < n - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        dxs.push(dx);
        dys.push(dy);
        slopes.push(dy / dx);
    }

    // Calculate tangents
    const tangents = [];
    tangents.push(slopes[0]); // Start tangent
    for (let i = 0; i < n - 2; i++) {
        const m = slopes[i];
        const nextM = slopes[i + 1];
        if (m * nextM <= 0) {
            tangents.push(0);
        } else {
            tangents.push((3 * m * nextM) / (Math.max(m, nextM) + 2 * Math.min(m, nextM))); // Simple approximation
            // Or standard finite difference: (m + nextM) / 2
        }
    }
    tangents.push(slopes[n - 2]); // End tangent

    // Generate Bezier control points
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < n - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const dx = dxs[i];
        const m1 = tangents[i];
        const m2 = tangents[i + 1];

        const cp1x = p1.x + dx / 3;
        const cp1y = p1.y + m1 * dx / 3;
        const cp2x = p2.x - dx / 3;
        const cp2y = p2.y - m2 * dx / 3;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
}
