"use client"
import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Select, Input, Checkbox } from 'antd';
import { ControlGroup } from '../ui/controls';
import {
    defaultDragDropConfig,
    defaultDragDropAction,
    DragDropConfig,
    DragDropAction,
    animationEffects,
    animationDirections,
} from '@/utils/config/defaults';
import { audioList } from '@/utils/config/audioList';
import { effectsList } from '@/utils/config/effectsList';
import useStoreconfig from '@/store';

// ── Action type options ──────────────────────────────────────────────────────

const ACTION_TYPES = [
    { label: '🔊 Audio',            value: 'audio' },
    { label: '✨ Effect',           value: 'effect' },
    { label: '🎬 Animation',        value: 'animation' },
    { label: '📄 Go to Page',       value: 'go-to-page' },
    { label: '↩️ Return to Origin', value: 'return-to-origin' },
    { label: '⭐ Score',            value: 'score' },
];

// ── Single action row ────────────────────────────────────────────────────────

const ActionRow = ({
    action,
    allpages,
    onChange,
    onDelete,
}: {
    action: DragDropAction;
    allpages: any;
    onChange: (a: DragDropAction) => void;
    onDelete: () => void;
}) => {
    const set = (key: keyof DragDropAction, val: any) => onChange({ ...action, [key]: val });

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Select
                    className="flex-1 h-8"
                    value={action.type}
                    onChange={(v) => set('type', v)}
                    options={ACTION_TYPES}
                />
                <button
                    onClick={onDelete}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none px-1"
                >
                    ×
                </button>
            </div>

            {action.type === 'audio' && (
                <div className="flex flex-col gap-2">
                    <Select
                        className="w-full h-8"
                        value={action.audioSrc}
                        onChange={(v) => set('audioSrc', v)}
                        options={[
                            { label: 'Custom URL…', value: '' },
                            ...audioList.map((a: any) => ({ label: a.name, value: a.src })),
                        ]}
                        placeholder="Pick audio"
                    />
                    <Input
                        size="small"
                        value={action.audioSrc}
                        onChange={(e) => set('audioSrc', e.target.value)}
                        placeholder="…or paste URL"
                    />
                    <Checkbox checked={action.loop} onChange={(e) => set('loop', e.target.checked)}>Loop</Checkbox>
                </div>
            )}

            {action.type === 'effect' && (
                <Select
                    className="w-full h-8"
                    value={action.effectValue}
                    onChange={(v) => set('effectValue', v)}
                    options={effectsList.map((e: any) => ({ label: `${e.icon} ${e.name}`, value: e.value }))}
                    placeholder="Select effect"
                />
            )}

            {action.type === 'animation' && (
                <div className="flex gap-2">
                    <Select
                        className="flex-1 h-8"
                        value={action.animEffect}
                        onChange={(v) => set('animEffect', v)}
                        options={animationEffects}
                        placeholder="Effect"
                    />
                    <Select
                        className="w-28 h-8"
                        value={action.animDirection}
                        onChange={(v) => set('animDirection', v)}
                        options={animationDirections}
                        placeholder="Dir"
                    />
                    <Input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={action.animSpeed}
                        onChange={(e) => set('animSpeed', Number(e.target.value))}
                        style={{ width: 64 }}
                        suffix="s"
                        size="small"
                    />
                </div>
            )}

            {action.type === 'go-to-page' && (
                <Select
                    className="w-full h-8"
                    value={action.targetPageId}
                    onChange={(v) => set('targetPageId', v)}
                    options={[
                        { label: 'None', value: '' },
                        ...(allpages?.pages?.map((p: any) => ({
                            label: p.title || `Page ${p.id}`,
                            value: p.id,
                        })) ?? []),
                    ]}
                    placeholder="Select page"
                />
            )}

            {action.type === 'return-to-origin' && (
                <p className="text-xs text-gray-400 italic">
                    The element snaps back to its original position.
                </p>
            )}

            {action.type === 'score' && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Points:</span>
                    <Input
                        type="number"
                        value={action.scoreValue}
                        onChange={(e) => set('scoreValue', Number(e.target.value))}
                        style={{ width: 80 }}
                        size="small"
                    />
                    <span className="text-xs text-gray-400">(negative to subtract)</span>
                </div>
            )}
        </div>
    );
};

// ── Outcome section (Correct / Wrong / Missed) ───────────────────────────────

const OutcomeSection = ({
    actions,
    allpages,
    onChange,
    timeout,
    onTimeoutChange,
}: {
    actions: DragDropAction[];
    allpages: any;
    onChange: (actions: DragDropAction[]) => void;
    timeout?: number;
    onTimeoutChange?: (v: number) => void;
}) => {
    const add = () => onChange([...actions, defaultDragDropAction()]);
    const update = (i: number, a: DragDropAction) => { const c = [...actions]; c[i] = a; onChange(c); };
    const remove = (i: number) => onChange(actions.filter((_, idx) => idx !== i));

    return (
        <div className="flex flex-col gap-2 pt-2">
            {onTimeoutChange !== undefined && (
                <ControlGroup label="Timeout (seconds, 0 = disabled)">
                    <Input
                        type="number"
                        min={0}
                        step={1}
                        value={timeout}
                        onChange={(e) => onTimeoutChange(Number(e.target.value))}
                        style={{ width: 100 }}
                        size="small"
                        suffix="s"
                    />
                </ControlGroup>
            )}
            {actions.map((action, i) => (
                <ActionRow
                    key={action.id}
                    action={action}
                    allpages={allpages}
                    onChange={(a) => update(i, a)}
                    onDelete={() => remove(i)}
                />
            ))}
            {actions.length === 0 && (
                <p className="text-xs text-gray-400 italic">No actions yet.</p>
            )}
            <button
                onClick={add}
                className="w-full py-1.5 border border-dashed border-blue-300 text-blue-500 text-xs rounded-lg hover:bg-blue-50 transition-colors"
            >
                + Add Action
            </button>
        </div>
    );
};

// ── Main modal ───────────────────────────────────────────────────────────────

const DragDropModal = () => {
    const {
        allpages, dragDrop,
        setDragDropElementIndex, setDragDropData,
        setDragDropTargetSelectionMode, setPendingDragDropTargetId,
        editor, updateEditor,
    } = useStoreconfig();

    const Data: any[] = editor?.elementsList ?? [];
    const [local, setLocal] = useState<DragDropConfig>(dragDrop?.data ?? defaultDragDropConfig);

    // Sync when modal opens for a new element
    useEffect(() => {
        if (dragDrop?.elementIndex !== null) {
            setLocal(dragDrop?.data ?? defaultDragDropConfig);
        }
    }, [dragDrop?.data]);

    // Consume canvas-picked target
    useEffect(() => {
        if (dragDrop?.pendingTargetElementId != null) {
            setLocal(prev => ({ ...prev, dropTargetId: dragDrop.pendingTargetElementId }));
            setPendingDragDropTargetId(null);
        }
    }, [dragDrop?.pendingTargetElementId]);

    const setOutcome = (key: 'correctDrop' | 'wrongDrop' | 'missedDrop', actions: DragDropAction[]) =>
        setLocal(prev => ({ ...prev, [key]: { ...prev[key], actions } }));

    const handleSave = () => {
        const dup = [...Data];
        dup[dragDrop.elementIndex!] = { ...dup[dragDrop.elementIndex!], dragDrop: local };
        updateEditor(dup);
        setDragDropElementIndex(null);
        setDragDropData(null);
    };

    const handleCancel = () => {
        setDragDropElementIndex(null);
        setDragDropData(null);
    };

    const dropTargetEl = local.dropTargetId
        ? Data.find(el => el.id === local.dropTargetId)
        : null;

    const countBadge = (n: number, color: string) =>
        n > 0 ? <span className={`ml-1 text-[9px] px-1 rounded ${color}`}>{n}</span> : null;

    const tabs = [
        {
            key: 'target',
            label: 'Drop Target',
            children: (
                <div className="flex flex-col gap-4 pt-2">
                    <ControlGroup label="Target Element">
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => setDragDropTargetSelectionMode(true)}
                                className="flex-1 h-8 px-3 rounded border border-dashed border-orange-400 text-orange-600 text-sm hover:bg-orange-50 transition-colors"
                            >
                                {local.dropTargetId ? 'Change target' : 'Pick from canvas'}
                            </button>
                            {local.dropTargetId && (
                                <button
                                    onClick={() => setLocal(p => ({ ...p, dropTargetId: null }))}
                                    className="h-8 px-2 rounded border border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors text-sm"
                                >✕</button>
                            )}
                        </div>
                    </ControlGroup>

                    {dropTargetEl ? (
                        <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-2">
                            {/* Mini preview */}
                            <div className="w-16 h-12 flex-shrink-0 rounded border border-orange-200 bg-white overflow-hidden flex items-center justify-center">
                                {dropTargetEl.type === 'img' && (
                                    <img src={dropTargetEl.src} alt="" className="w-full h-full object-contain" />
                                )}
                                {dropTargetEl.type === 'text' && (
                                    <span className="text-[10px] px-1 text-center leading-tight overflow-hidden" style={{ color: dropTargetEl.font?.color || '#000' }}>
                                        {(dropTargetEl.text || '').slice(0, 28)}
                                    </span>
                                )}
                                {dropTargetEl.type === 'audio' && <i className="fa-solid fa-music text-gray-400" />}
                                {dropTargetEl.type === 'group' && <i className="fa-solid fa-object-group text-gray-400" />}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-orange-700 capitalize">{dropTargetEl.type}</p>
                                <p className="text-[11px] text-gray-400">ID: {dropTargetEl.id}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic">No drop target set. Click above to pick one from the canvas.</p>
                    )}
                </div>
            ),
        },
        {
            key: 'correct',
            label: <span>✅ Correct{countBadge(local.correctDrop.actions.length, 'bg-green-100 text-green-700')}</span>,
            children: (
                <OutcomeSection
                    actions={local.correctDrop.actions}
                    allpages={allpages}
                    onChange={a => setOutcome('correctDrop', a)}
                />
            ),
        },
        {
            key: 'wrong',
            label: <span>❌ Wrong{countBadge(local.wrongDrop.actions.length, 'bg-red-100 text-red-600')}</span>,
            children: (
                <OutcomeSection
                    actions={local.wrongDrop.actions}
                    allpages={allpages}
                    onChange={a => setOutcome('wrongDrop', a)}
                />
            ),
        },
        {
            key: 'missed',
            label: <span>⏱️ Missed{countBadge(local.missedDrop.actions.length, 'bg-yellow-100 text-yellow-700')}</span>,
            children: (
                <OutcomeSection
                    actions={local.missedDrop.actions}
                    allpages={allpages}
                    onChange={a => setOutcome('missedDrop', a)}
                    timeout={local.missedDrop.timeout}
                    onTimeoutChange={v => setLocal(p => ({ ...p, missedDrop: { ...p.missedDrop, timeout: v } }))}
                />
            ),
        },
    ];

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-hand-pointer text-orange-500" />
                    <span>Configure Drag &amp; Drop</span>
                </div>
            }
            open={dragDrop?.elementIndex !== null && !dragDrop?.targetSelectionMode}
            onOk={handleSave}
            onCancel={handleCancel}
            okText="Save"
            zIndex={2000}
            width={560}
        >
            <Tabs items={tabs} defaultActiveKey="target" />
        </Modal>
    );
};

export default DragDropModal;
