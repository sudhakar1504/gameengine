import React, { useState, useLayoutEffect, useRef, useMemo } from 'react'
import DraggableBox from '../Dragbox/index'
import useStoreconfig from '@/store';

const Slideview = () => {
    const { editor } = useStoreconfig();
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
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const bgIndex = useMemo(() => {
        return editor?.elementsList?.findIndex((item: any) => item.type === "bg")
    }, [editor?.elementsList])
    return (
        <div
            ref={containerRef}
            className={`relative h-full w-full user-select-none`}
            style={editor?.elementsList[bgIndex]?.type === "bg" ? {
                backgroundImage: `url( ${editor?.elementsList[bgIndex]?.src || ""})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            } : {}}
            id='slideview'>
            <div className="absolute top-0 left-0 p-1 text-[10px] text-gray-400 z-50 pointer-events-none">
                Width: {dimensions.width}px
            </div>
            {editor?.elementsList && editor?.elementsList?.map((item: any, index: number) => {
                if (item.type === "bg") {
                    return (<></>
                        // <div key={item.id} className='absolute top-0 left-0 w-full h-full'>
                        //     <img src={item.src} className='w-full h-full object-cover' alt="" />
                        // </div>
                    )
                }
                return (
                    <DraggableBox key={item.id} item={item} index={index} />
                )
            })}
        </div>
    )
}

export default Slideview