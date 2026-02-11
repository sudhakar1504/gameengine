import React, { useState, useLayoutEffect, useRef, useMemo } from 'react'
import DraggableBox from '../Dragbox/index'
import useStoreconfig from '@/store';

const Slideview = () => {
    const { editor, setSelectedElementIds, updateEditor } = useStoreconfig();
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const startPos = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const [showGroupOption, setShowGroupOption] = useState(false);

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

    const onMouseDown = (e: React.MouseEvent) => {
        if (e.target === containerRef.current || (e.target as HTMLElement).id === 'slideview') {
            const rect = containerRef.current!.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            startPos.current = { x, y };
            setIsSelecting(true);
            setSelectionBox({ x, y, width: 0, height: 0 });
            setSelectedElementIds([]); // Clear previous selection
            setShowGroupOption(false);
        }
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isSelecting) return;
        const rect = containerRef.current!.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const x = Math.min(currentX, startPos.current.x);
        const y = Math.min(currentY, startPos.current.y);
        const width = Math.abs(currentX - startPos.current.x);
        const height = Math.abs(currentY - startPos.current.y);

        setSelectionBox({ x, y, width, height });
    };

    const onMouseUp = () => {
        if (!isSelecting) return;
        setIsSelecting(false);

        if (selectionBox && containerRef.current) {
            const selectedIds: number[] = [];
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;

            editor?.elementsList?.forEach((item: any) => {
                if (item.type === 'bg') return;
                // Convert item % coords to px
                const itemX = (item.coords.x / 100) * containerWidth;
                const itemY = (item.coords.y / 100) * containerHeight;
                const itemW = (item.coords.width / 100) * containerWidth;
                const itemH = (item.coords.height / 100) * containerHeight;

                // Check intersection
                if (
                    itemX < selectionBox.x + selectionBox.width &&
                    itemX + itemW > selectionBox.x &&
                    itemY < selectionBox.y + selectionBox.height &&
                    itemY + itemH > selectionBox.y
                ) {
                    selectedIds.push(item.id);
                }
            });

            if (selectedIds.length > 0) {
                setSelectedElementIds(selectedIds);
                if (selectedIds.length > 1) {
                    setShowGroupOption(true);
                }
            }
        }
        setSelectionBox(null);
    };

    const handleGroup = () => {
        if (!editor.selectedElementIds || editor.selectedElementIds.length < 2) return;

        const selectedIds = editor.selectedElementIds;
        const selectedElements = editor.elementsList.filter((el: any) => selectedIds.includes(el.id));
        const otherElements = editor.elementsList.filter((el: any) => !selectedIds.includes(el.id));

        const containerWidth = dimensions.width;
        const containerHeight = dimensions.height;

        // Calculate bounding box in pixels
        let minX = Infinity, minY = Infinity, maxY = -Infinity, maxX = -Infinity;

        selectedElements.forEach((el: any) => {
            const elX = (el.coords.x / 100) * containerWidth;
            const elY = (el.coords.y / 100) * containerHeight;
            const elW = (el.coords.width / 100) * containerWidth;
            const elH = (el.coords.height / 100) * containerHeight;

            minX = Math.min(minX, elX);
            minY = Math.min(minY, elY);
            maxX = Math.max(maxX, elX + elW);
            maxY = Math.max(maxY, elY + elH);
        });

        const bbox = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };

        // Create Group Element
        const newGroup = {
            id: Date.now(),
            type: 'group',
            coords: {
                x: (bbox.x / containerWidth) * 100,
                y: (bbox.y / containerHeight) * 100,
                width: (bbox.width / containerWidth) * 100,
                height: (bbox.height / containerHeight) * 100,
                angle: 0
            },
            zIndex: Math.max(...selectedElements.map((el: any) => el.zIndex || 1)),
            children: selectedElements.map((el: any) => {
                const elX = (el.coords.x / 100) * containerWidth;
                const elY = (el.coords.y / 100) * containerHeight;
                const elW = (el.coords.width / 100) * containerWidth;
                const elH = (el.coords.height / 100) * containerHeight;

                return {
                    ...el,
                    coords: {
                        x: ((elX - bbox.x) / bbox.width) * 100,
                        y: ((elY - bbox.y) / bbox.height) * 100,
                        width: (elW / bbox.width) * 100,
                        height: (elH / bbox.height) * 100,
                        angle: el.coords.angle
                    }
                };
            })
        };

        updateEditor([...otherElements, newGroup]);
        setSelectedElementIds([newGroup.id]);
        setShowGroupOption(false);
    };

    const bgIndex = useMemo(() => {
        return editor?.elementsList?.findIndex((item: any) => item.type === "bg")
    }, [editor?.elementsList])
    return (
        <div
            ref={containerRef}
            className={`relative h-full w-full user-select-none`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            style={editor?.elementsList[bgIndex]?.type === "bg" ? {
                backgroundImage: `url( ${editor?.elementsList[bgIndex]?.src || ""})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            } : {}}
            id='slideview'>
            <div className="absolute top-0 left-0 p-1 text-[10px] text-gray-400 z-50 pointer-events-none">
                Width: {dimensions.width}px
            </div>
            {selectionBox && (
                <div style={{
                    position: 'absolute',
                    left: selectionBox.x,
                    top: selectionBox.y,
                    width: selectionBox.width,
                    height: selectionBox.height,
                    border: '1px dashed #007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    pointerEvents: 'none',
                    zIndex: 9999
                }} />
            )}
            {showGroupOption && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white shadow-lg rounded px-4 py-2 flex gap-2">
                    <button onClick={handleGroup} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                        Group Selected
                    </button>
                    <button onClick={() => setShowGroupOption(false)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">
                        Cancel
                    </button>
                </div>
            )}
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