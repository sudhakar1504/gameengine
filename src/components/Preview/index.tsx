"use client"
import React, { useRef, useState, useLayoutEffect, useMemo, useEffect, useCallback } from 'react';
import PreviewElement from './PreviewElement';
import useStoreconfig from '@/store';
import { useRouter } from 'next/navigation';


const Preview = () => {
    const { allpages, setSelectedPage } = useStoreconfig();
    const router = useRouter();
    const [currentPageId, setCurrentPageId] = useState(allpages?.selectedPage);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [animTriggers, setAnimTriggers] = useState<Record<string | number, { config: any; tick: number }>>({});
    // Drag-drop state
    const [droppedElements, setDroppedElements] = useState<Set<string | number>>(new Set());
    const droppedRef = useRef<Set<string | number>>(new Set()); // ref for stale-closure-safe checks
    const [score, setScore] = useState(0);
    const [elementActions, setElementActions] = useState<Record<string | number, { actions: any[]; tick: number }>>({});
    const missedTimers = useRef<Map<string | number, ReturnType<typeof setTimeout>>>(new Map());

    // Declare currentPage early so drag-drop callbacks can reference it
    const currentPage = useMemo(() => {
        return allpages?.pages?.find((p: any) => p.id === allpages?.selectedPage) || allpages?.pages?.[0];
    }, [allpages?.pages, allpages?.selectedPage]);

    const handleTriggerAnimation = (elementId: string | number, animConfig: any) => {
        setAnimTriggers(prev => ({
            ...prev,
            [elementId]: { config: animConfig, tick: Date.now() }
        }));
    };

    // Keep ref in sync so timeout callbacks aren't stale
    useEffect(() => { droppedRef.current = droppedElements; }, [droppedElements]);

    const dispatchElementActions = useCallback((elementId: string | number, actions: any[]) => {
        setElementActions(prev => ({ ...prev, [elementId]: { actions, tick: Date.now() } }));
    }, []);

    const handleDrop = useCallback((sourceId: string | number, dropXPct: number, dropYPct: number) => {
        const allElements = currentPage?.data || [];
        const sourceEl = allElements.find((el: any) => el.id === sourceId);
        if (!sourceEl?.dragDrop?.dropTargetId) return;
        const targetEl = allElements.find((el: any) => el.id === sourceEl.dragDrop.dropTargetId);
        if (!targetEl) return;

        const { coords: tc } = targetEl;
        const isCorrect =
            dropXPct >= tc.x && dropXPct <= tc.x + tc.width &&
            dropYPct >= tc.y && dropYPct <= tc.y + tc.height;

        if (isCorrect) {
            // Cancel any pending missed-drop timer for this element
            if (missedTimers.current.has(sourceId)) {
                clearTimeout(missedTimers.current.get(sourceId)!);
                missedTimers.current.delete(sourceId);
            }
            setDroppedElements(prev => new Set([...prev, sourceId]));
            const snapDx = ((tc.x + tc.width / 2 - sourceEl.coords.x - sourceEl.coords.width / 2) / 100) * dimensions.width;
            const snapDy = ((tc.y + tc.height / 2 - sourceEl.coords.y - sourceEl.coords.height / 2) / 100) * dimensions.height;
            const actions = [{ type: 'snap-to', dx: snapDx, dy: snapDy }, ...sourceEl.dragDrop.correctDrop.actions];
            // score from actions
            sourceEl.dragDrop.correctDrop.actions.forEach((a: any) => {
                if (a.type === 'score') setScore(prev => prev + (a.scoreValue || 0));
                if (a.type === 'go-to-page') setSelectedPage(Number(a.targetPageId));
            });
            dispatchElementActions(sourceId, actions);
        } else {
            const actions = [{ type: 'snap-back' }, ...sourceEl.dragDrop.wrongDrop.actions];
            sourceEl.dragDrop.wrongDrop.actions.forEach((a: any) => {
                if (a.type === 'score') setScore(prev => prev + (a.scoreValue || 0));
                if (a.type === 'go-to-page') setSelectedPage(Number(a.targetPageId));
            });
            dispatchElementActions(sourceId, actions);
        }
    }, [currentPage, dimensions]);

    // Start missed-drop timer only when user picks up an element
    const handleDragStart = useCallback((sourceId: string | number) => {
        if (droppedRef.current.has(sourceId)) return; // already correctly placed
        const allElements = currentPage?.data || [];
        const el = allElements.find((e: any) => e.id === sourceId);
        if (!el?.dragDrop?.missedDrop?.timeout || el.dragDrop.missedDrop.timeout <= 0) return;

        // Cancel any existing timer for this element before starting a new one
        if (missedTimers.current.has(sourceId)) {
            clearTimeout(missedTimers.current.get(sourceId)!);
        }

        const timer = setTimeout(() => {
            missedTimers.current.delete(sourceId);
            if (droppedRef.current.has(sourceId)) return; // was correctly dropped in the meantime
            el.dragDrop.missedDrop.actions.forEach((a: any) => {
                if (a.type === 'score') setScore(prev => prev + (a.scoreValue || 0));
                if (a.type === 'go-to-page') setSelectedPage(Number(a.targetPageId));
            });
            dispatchElementActions(sourceId, [{ type: 'snap-back' }, ...el.dragDrop.missedDrop.actions]);
        }, el.dragDrop.missedDrop.timeout * 1000);

        missedTimers.current.set(sourceId, timer);
    }, [currentPage]);

    useLayoutEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        // Initial update
        updateDimensions();

        // Update on resize
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const data = currentPage?.data || [];

    // Find background if any
    const bgItem = data.find((item: any) => item.type === "bg");

    const bgState = bgItem ? {
        backgroundImage: `url(${bgItem.src || ""})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    } : {
        backgroundColor: '#ffffff'
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
            {/* Close Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-4 right-4 z-[10000] px-4 py-2 bg-white/20 hover:bg-white/40 text-white rounded backdrop-blur-md transition-all border border-white/30"
            >
                <i className="fa-solid fa-xmark mr-2"></i>
                Exit Preview
            </button>

            {/* Scaleable Container */}
            <div
                ref={containerRef}
                className="relative overflow-hidden shadow-2xl"
                style={{
                    width: '100vw',
                    height: '60vw', // 1000x600 aspect ratio
                    maxHeight: '100vh',
                    maxWidth: '166.67vh',
                    ...bgState
                }}
            >
                <div className="absolute top-0 left-0 p-1 text-[10px] text-gray-400 z-[10001] pointer-events-none">
                    Width: {dimensions.width}px
                </div>
                {score !== 0 && (
                    <div className="absolute top-2 right-2 z-[10001] bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                        ⭐ Score: {score > 0 ? '+' : ''}{score}
                    </div>
                )}
                {data.map((item: any) => {
                    if (item.type === 'bg') return null;
                    return (
                        <PreviewElement
                            width={dimensions.width}
                            height={dimensions.height}
                            key={item.id}
                            item={item}
                            onPageChange={(id) => { setSelectedPage(id); }}
                            onTriggerAnimation={handleTriggerAnimation}
                            externalAnimTrigger={animTriggers[item.id]}
                            onDrop={handleDrop}
                            onDragStart={handleDragStart}
                            externalActions={elementActions[item.id]}
                            isDropped={droppedElements.has(item.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Preview;
