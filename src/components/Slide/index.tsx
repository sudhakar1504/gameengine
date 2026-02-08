import React, { useState, useLayoutEffect, useRef } from 'react'
import DraggableBox from '../Dragbox/index'

const Slideview = ({ Data, setData, SelectedID, setSelectedID, Allpages }: { Data: any, setData: any, SelectedID: any, setSelectedID: any, Allpages: any }) => {
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

    let bgIndex = Data.findIndex((item: any) => item.type === "bg");
    return (
        <div
            ref={containerRef}
            className={`relative h-full w-full user-select-none`}
            style={Data[bgIndex]?.type === "bg" ? {
                backgroundImage: `url( ${Data[bgIndex]?.src || ""})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            } : {}}
            id='slideview'>
            <div className="absolute top-0 left-0 p-1 text-[10px] text-gray-400 z-50 pointer-events-none">
                Width: {dimensions.width}px
            </div>
            {Data && Data?.map((item: any, index: number) => {
                if (item.type === "bg") {
                    return (<></>
                        // <div key={item.id} className='absolute top-0 left-0 w-full h-full'>
                        //     <img src={item.src} className='w-full h-full object-cover' alt="" />
                        // </div>
                    )
                }
                return (
                    <DraggableBox key={item.id} Data={Data} setData={setData} item={item} index={index} SelectedID={SelectedID} setSelectedID={setSelectedID} Allpages={Allpages} />
                )
            })}
        </div>
    )
}

export default Slideview