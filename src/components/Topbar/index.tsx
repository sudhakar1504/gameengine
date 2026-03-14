import React, { useMemo } from 'react';
import TextPanel from './TextPanel';
import ImagePanel from './ImagePanel';
import AudioPanel from './AudioPanel';
import useStoreconfig from '@/store';

const Topbar = () => {
    const { editor, interaction, setTriggerSelectionMode, dragDrop, setDragDropTargetSelectionMode } = useStoreconfig();
    const item = useMemo(() => {
        return editor?.elementsList?.find((i: any) => i.id === editor?.selectedElementId);
    }, [editor?.elementsList]);

    const isSelectionMode = interaction?.triggerSelectionMode;
    const isDragDropTargetMode = dragDrop?.targetSelectionMode;

    if (isDragDropTargetMode) {
        return (
            <div className='w-full h-full bg-orange-50 border-b border-orange-300 flex items-center px-4 shadow-sm py-2 gap-4'>
                <div className="flex items-center gap-2 flex-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs">
                        <i className="fa-solid fa-bullseye" />
                    </span>
                    <span className="text-sm font-medium text-orange-800">
                        Click any element on the canvas to set it as the drop target
                    </span>
                </div>
                <button
                    onClick={() => setDragDropTargetSelectionMode(false)}
                    className="px-3 py-1 rounded border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        );
    }

    if (isSelectionMode) {
        return (
            <div className='w-full h-full bg-green-50 border-b border-green-300 flex items-center px-4 shadow-sm py-2 gap-4'>
                <div className="flex items-center gap-2 flex-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs">
                        <i className="fa-solid fa-hand-pointer" />
                    </span>
                    <span className="text-sm font-medium text-green-800">
                        Click any element on the canvas to set it as the animation target
                    </span>
                </div>
                <button
                    onClick={() => {
                        setTriggerSelectionMode(false);
                    }}
                    className="px-3 py-1 rounded border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className='w-full h-full bg-gray-100 border-b border-gray-300 flex items-center px-4 shadow-sm py-2'>
            {!item && <div className="text-gray-400 text-xs italic">Select an element to edit</div>}
            {item && (
                <div className='w-full bg-transparent flex flex-col'>
                    {item.type === 'text' && <TextPanel item={item} />}
                    {item.type === 'img' && <ImagePanel item={item} />}
                    {item.type === 'audio' && <AudioPanel item={item} />}
                </div>
            )}
        </div>
    );
};

export default Topbar;