"use client"
import React, { useMemo } from 'react';
import useStoreconfig from '@/store';

interface Props {
    containerWidth: number;
    containerHeight: number;
}

const centerOf = (coords: any, W: number, H: number) => ({
    x: ((coords.x + coords.width / 2) / 100) * W,
    y: ((coords.y + coords.height / 2) / 100) * H,
});

// Cubic bezier at t=0.5 approximation for midpoint indicator
const bezierMid = (p0: number, p1: number, p2: number, p3: number) =>
    0.125 * p0 + 0.375 * p1 + 0.375 * p2 + 0.125 * p3;

const DragDropConnector = ({ containerWidth: W, containerHeight: H }: Props) => {
    const { editor, setDragDropElementIndex, setDragDropData } = useStoreconfig();
    const elements: any[] = editor?.elementsList ?? [];

    const connections = useMemo(() => {
        return elements
            .map((el, index) => {
                if (!el.dragDrop?.dropTargetId) return null;
                const target = elements.find(t => t.id === el.dragDrop.dropTargetId);
                if (!target) return null;
                return { el, index, target };
            })
            .filter(Boolean) as { el: any; index: number; target: any }[];
    }, [elements]);

    if (!connections.length || !W || !H) return null;

    return (
        <svg
            style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none',
                zIndex: 2,
                overflow: 'visible',
            }}
        >
            <defs>
                <marker id="dd-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#f97316" opacity={0.9} />
                </marker>
            </defs>

            {connections.map(({ el, index, target }) => {
                const src = centerOf(el.coords, W, H);
                const tgt = centerOf(target.coords, W, H);

                // S-curve control points: arc upward between the two elements
                const cp1x = src.x + (tgt.x - src.x) * 0.5;
                const cp1y = src.y;
                const cp2x = src.x + (tgt.x - src.x) * 0.5;
                const cp2y = tgt.y;

                const d = `M ${src.x} ${src.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tgt.x} ${tgt.y}`;

                // Midpoint on the bezier for the gear icon button
                const mx = bezierMid(src.x, cp1x, cp2x, tgt.x);
                const my = bezierMid(src.y, cp1y, cp2y, tgt.y);

                const open = () => {
                    setDragDropElementIndex(index);
                    setDragDropData(el.dragDrop);
                };

                return (
                    <g key={`${el.id}-dd`}>
                        {/* Wide invisible path for easy clicking */}
                        <path
                            d={d} fill="none" stroke="transparent" strokeWidth={14}
                            style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                            onClick={open}
                        />
                        {/* Visible dashed orange path */}
                        <path
                            d={d} fill="none"
                            stroke="#f97316" strokeWidth={2.5}
                            strokeDasharray="7 4" opacity={0.85}
                            markerEnd="url(#dd-arrow)"
                            style={{ pointerEvents: 'none' }}
                        />
                        {/* Source dot */}
                        <circle cx={src.x} cy={src.y} r={5} fill="#f97316" style={{ pointerEvents: 'none' }} />
                        {/* Midpoint clickable badge */}
                        <circle
                            cx={mx} cy={my} r={11}
                            fill="#f97316"
                            style={{ pointerEvents: 'all', cursor: 'pointer' }}
                            onClick={open}
                        />
                        <text
                            x={mx} y={my} textAnchor="middle" dy="0.35em"
                            fontSize="10" fill="white"
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                            ✎
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default DragDropConnector;
