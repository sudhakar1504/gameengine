import React, { useState, useRef } from 'react';
import { Modal, Button, Input, Select } from 'antd';

export interface WindowElement {
    id: number;
    type: 'text' | 'img';
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    src?: string;
    fontSize?: number;
    color?: string;
}

interface Props {
    open: boolean;
    title: string;
    elements: WindowElement[];
    onSave: (elements: WindowElement[]) => void;
    onClose: () => void;
}

const CANVAS_W = 580;
const CANVAS_H = 380;

const WindowEditorModal = ({ open, title, elements, onSave, onClose }: Props) => {
    const [localElements, setLocalElements] = useState<WindowElement[]>(elements);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const dragState = useRef<{ id: number; startX: number; startY: number; origX: number; origY: number } | null>(null);
    const resizeState = useRef<{ id: number; startX: number; startY: number; origW: number; origH: number } | null>(null);

    const selectedEl = localElements.find(el => el.id === selectedId) || null;

    const updateEl = (id: number, updates: Partial<WindowElement>) => {
        setLocalElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    };

    const deleteEl = (id: number) => {
        setLocalElements(prev => prev.filter(el => el.id !== id));
        setSelectedId(null);
    };

    const addText = () => {
        const el: WindowElement = {
            id: Date.now(),
            type: 'text',
            x: 40, y: 40, width: 180, height: 44,
            text: 'Text', fontSize: 16, color: '#000000',
        };
        setLocalElements(prev => [...prev, el]);
        setSelectedId(el.id);
    };

    const addImage = () => {
        const src = prompt('Paste image URL:');
        if (!src) return;
        const el: WindowElement = {
            id: Date.now(),
            type: 'img',
            x: 60, y: 80, width: 160, height: 120,
            src,
        };
        setLocalElements(prev => [...prev, el]);
        setSelectedId(el.id);
    };

    const handleMouseDown = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setSelectedId(id);
        setEditingId(null);
        const el = localElements.find(el => el.id === id)!;
        dragState.current = { id, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y };

        const onMove = (ev: MouseEvent) => {
            if (!dragState.current) return;
            const dx = ev.clientX - dragState.current.startX;
            const dy = ev.clientY - dragState.current.startY;
            setLocalElements(prev => prev.map(el =>
                el.id === dragState.current!.id
                    ? { ...el, x: dragState.current!.origX + dx, y: dragState.current!.origY + dy }
                    : el
            ));
        };
        const onUp = () => {
            dragState.current = null;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    const handleResizeDown = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const el = localElements.find(el => el.id === id)!;
        resizeState.current = { id, startX: e.clientX, startY: e.clientY, origW: el.width, origH: el.height };

        const onMove = (ev: MouseEvent) => {
            if (!resizeState.current) return;
            const dw = ev.clientX - resizeState.current.startX;
            const dh = ev.clientY - resizeState.current.startY;
            setLocalElements(prev => prev.map(el =>
                el.id === resizeState.current!.id
                    ? { ...el, width: Math.max(60, resizeState.current!.origW + dw), height: Math.max(24, resizeState.current!.origH + dh) }
                    : el
            ));
        };
        const onUp = () => {
            resizeState.current = null;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    return (
        <Modal
            title={`Edit Window Content — "${title}"`}
            open={open}
            onOk={() => { onSave(localElements); onClose(); }}
            onCancel={onClose}
            okText="Save"
            width={CANVAS_W + 120}
            zIndex={3000}
            destroyOnClose
        >
            {/* Toolbar */}
            <div className="flex gap-2 mb-3 items-center">
                <Button size="small" onClick={addText} icon={<span style={{ fontSize: 12 }}>T</span>}>Add Text</Button>
                <Button size="small" onClick={addImage} icon={<span style={{ fontSize: 12 }}>🖼</span>}>Add Image</Button>
                <span style={{ flex: 1 }} />
                {selectedEl && (
                    <Button size="small" danger onClick={() => deleteEl(selectedEl.id)}>Delete</Button>
                )}
            </div>

            {/* Properties bar for selected element */}
            {selectedEl && selectedEl.type === 'text' && (
                <div className="flex gap-2 mb-3 items-center flex-wrap" style={{ background: '#f5f5f5', padding: '6px 10px', borderRadius: 6 }}>
                    <span style={{ fontSize: 11, color: '#888' }}>Text:</span>
                    <Input
                        size="small"
                        style={{ width: 160 }}
                        value={selectedEl.text}
                        onChange={e => updateEl(selectedEl.id, { text: e.target.value })}
                    />
                    <span style={{ fontSize: 11, color: '#888' }}>Size:</span>
                    <Input
                        size="small"
                        type="number"
                        style={{ width: 60 }}
                        value={selectedEl.fontSize}
                        onChange={e => updateEl(selectedEl.id, { fontSize: Number(e.target.value) })}
                    />
                    <span style={{ fontSize: 11, color: '#888' }}>Color:</span>
                    <input
                        type="color"
                        value={selectedEl.color}
                        onChange={e => updateEl(selectedEl.id, { color: e.target.value })}
                        style={{ width: 28, height: 24, border: 'none', cursor: 'pointer', background: 'none' }}
                    />
                </div>
            )}

            {/* Canvas */}
            <div
                style={{
                    width: CANVAS_W,
                    height: CANVAS_H,
                    position: 'relative',
                    border: '1px solid #d9d9d9',
                    background: '#fff',
                    overflow: 'hidden',
                    borderRadius: 6,
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
                onClick={() => { setSelectedId(null); setEditingId(null); }}
            >
                {localElements.length === 0 && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 13, pointerEvents: 'none' }}>
                        Add elements using the toolbar above
                    </div>
                )}
                {localElements.map(el => (
                    <div
                        key={el.id}
                        style={{
                            position: 'absolute',
                            left: el.x,
                            top: el.y,
                            width: el.width,
                            height: el.height,
                            border: selectedId === el.id ? '2px solid #1677ff' : '1px dashed #ccc',
                            boxSizing: 'border-box',
                            cursor: 'move',
                            userSelect: 'none',
                            borderRadius: 3,
                        }}
                        onMouseDown={e => handleMouseDown(e, el.id)}
                        onClick={e => e.stopPropagation()}
                        onDoubleClick={() => setEditingId(el.id)}
                    >
                        {el.type === 'text' && (
                            editingId === el.id
                                ? <input
                                    autoFocus
                                    value={el.text}
                                    onChange={e => updateEl(el.id, { text: e.target.value })}
                                    onBlur={() => setEditingId(null)}
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                        width: '100%', height: '100%', border: 'none', outline: 'none',
                                        background: 'transparent', fontSize: el.fontSize, color: el.color,
                                        padding: '2px 4px', cursor: 'text',
                                    }}
                                />
                                : <div style={{
                                    fontSize: el.fontSize,
                                    color: el.color,
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden',
                                    padding: '2px 4px',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}>{el.text}</div>
                        )}
                        {el.type === 'img' && (
                            <img
                                src={el.src}
                                draggable={false}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', display: 'block' }}
                                alt=""
                            />
                        )}
                        {/* Resize handle */}
                        {selectedId === el.id && (
                            <div
                                onMouseDown={e => { e.stopPropagation(); handleResizeDown(e, el.id); }}
                                style={{
                                    position: 'absolute', right: -5, bottom: -5,
                                    width: 10, height: 10,
                                    background: '#1677ff', borderRadius: 2,
                                    cursor: 'se-resize',
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: '#bbb' }}>
                Drag to move · Drag corner to resize · Double-click text to edit
            </div>
        </Modal>
    );
};

export default WindowEditorModal;
