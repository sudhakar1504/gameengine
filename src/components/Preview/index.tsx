"use client"
import React, { useRef, useState, useLayoutEffect } from 'react';
import PreviewElement from './PreviewElement';

interface PreviewProps {
    Allpages: any[];
    onExit: () => void;
    initialPageId: number;
}

const Preview = ({ Allpages, onExit, initialPageId }: PreviewProps) => {
    const [currentPageId, setCurrentPageId] = useState(initialPageId);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
    const currentPage = Allpages.find(p => p.id === currentPageId) || Allpages[0];
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
                onClick={onExit}
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
                {data.map((item: any) => {
                    if (item.type === 'bg') return null;
                    return (
                        <PreviewElement
                            width={dimensions.width}
                            height={dimensions.height}
                            key={item.id}
                            item={item}
                            onPageChange={(id) => setCurrentPageId(id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Preview;
