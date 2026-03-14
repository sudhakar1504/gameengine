import React, { useMemo } from 'react';
import TextPanel from './TextPanel';
import ImagePanel from './ImagePanel';
import AudioPanel from './AudioPanel';
import useStoreconfig from '@/store';
import { useRouter } from 'next/navigation';
import { downloadHtml } from '@/utils/exportHtml';

const Topbar = () => {
    const { editor, interaction, setTriggerSelectionMode, dragDrop, setDragDropTargetSelectionMode, allpages, updateAllPages } = useStoreconfig();
    const router = useRouter();

    const item = useMemo(() => {
        return editor?.elementsList?.find((i: any) => i.id === editor?.selectedElementId);
    }, [editor?.elementsList]);

    const isSelectionMode = interaction?.triggerSelectionMode;
    const isDragDropTargetMode = dragDrop?.targetSelectionMode;

    const enterPreview = () => {
        // save current page data
        const updated = allpages?.pages?.map((i: any) =>
            i.id === allpages?.selectedPage ? { ...i, data: editor?.elementsList } : i
        );
        updateAllPages(updated);
        router.push('/preview');
    };

    const handleExport = () => {
        const updatedPages = allpages?.pages?.map((i: any) =>
            i.id === allpages?.selectedPage ? { ...i, data: editor?.elementsList } : i
        );
        downloadHtml({ ...allpages, pages: updatedPages });
    };

    // Action buttons always shown on the right
    const ActionButtons = () => (
        <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            <button className="btn btn-ghost btn-sm" onClick={enterPreview} title="Preview">
                <i className="fa-solid fa-play" style={{ fontSize: 10 }}></i>
                Preview
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleExport} title="Export as HTML">
                <i className="fa-solid fa-file-export" style={{ fontSize: 10 }}></i>
                Export HTML
            </button>
        </div>
    );

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
                    onClick={() => setTriggerSelectionMode(false)}
                    className="px-3 py-1 rounded border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className='w-full h-full flex items-center px-4 py-1.5 gap-2' style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
            {!item && <div style={{ color: 'var(--text-muted)', fontSize: 11, fontStyle: 'italic' }}>Select an element to edit</div>}
            {item && (
                <div className='flex-1 min-w-0 bg-transparent'>
                    {item.type === 'text' && <TextPanel item={item} />}
                    {item.type === 'img' && <ImagePanel item={item} />}
                    {item.type === 'audio' && <AudioPanel item={item} />}
                </div>
            )}
            <ActionButtons />
        </div>
    );
};

export default Topbar;
