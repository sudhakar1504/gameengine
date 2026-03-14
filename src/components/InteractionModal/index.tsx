import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Tabs, Input, Checkbox, Select } from 'antd';
import { ControlGroup } from '../ui/controls';
import { defaultInteractionConfig, animationEffects, animationDirections, playDirections, animationEasingTypes } from '@/utils/config/defaults';
import { audioList } from '@/utils/config/audioList';
import { effectsList } from '@/utils/config/effectsList';
import useStoreconfig from '@/store';


const InteractionModal = () => {
    const { allpages, interaction, setElementIndex, setInteractionsData, setTriggerSelectionMode, setPendingTriggerElementId, editor, updateEditor } = useStoreconfig();
    const Data = editor?.elementsList;
    const [data, setData] = useState(interaction?.data || defaultInteractionConfig);
    const [activeTab, setActiveTab] = useState(interaction?.data?.type || 'none');

    useEffect(() => {
        if (interaction?.elementIndex !== null) {
            setData(interaction?.data || defaultInteractionConfig);
            setActiveTab(interaction?.data?.type || 'none');
        }
    }, [interaction?.data]);

    // When user picks a target element from canvas, consume the pending id
    useEffect(() => {
        if (interaction?.pendingTriggerElementId != null) {
            setData((prev: any) => ({ ...prev, triggerElementId: interaction.pendingTriggerElementId }));
            setPendingTriggerElementId(null);
        }
    }, [interaction?.pendingTriggerElementId]);

    const updateData = (key: string, value: any) => {
        setData((prev: any) => ({ ...prev, [key]: value }));
    };

    const updateTriggerAnim = (key: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            triggerAnimationConfig: { ...prev.triggerAnimationConfig, [key]: value }
        }));
    };

    const previewRef = useRef<HTMLDivElement>(null);

    const getAnimString = (anim: any) => {
        if (!anim || anim.effect === 'none') return '';
        let keyframeName = anim.effect;
        if (anim.effect === 'slide' && anim.direction !== 'none') {
            keyframeName = `slide-${anim.direction}`;
        }
        const playDirection = anim.animationDirection || 'normal';
        const transitionType = anim.transitionType || 'ease';
        return `${keyframeName} ${anim.speed || 1}s ${transitionType} ${anim.delay || 0}s ${playDirection} both`;
    };

    const playPreview = useCallback(() => {
        if (!previewRef.current) return;
        const anim = getAnimString(data.triggerAnimationConfig);
        if (!anim) return;
        previewRef.current.style.animation = 'none';
        void previewRef.current.offsetWidth; // force reflow to restart animation
        previewRef.current.style.animation = anim;
    }, [data.triggerAnimationConfig]);

    // Auto-play preview whenever animation config changes
    useEffect(() => {
        if (data.triggerElementId) playPreview();
    }, [data.triggerAnimationConfig]);

    const handleSave = () => {
        let duplicate = [...Data];
        duplicate[interaction?.elementIndex] = {
            ...duplicate[interaction?.elementIndex],
            interaction: data
        };
        updateEditor(duplicate);
        setElementIndex(null);
        setInteractionsData(null);
    };

    const cancelHandler = () => {
        setElementIndex(null);
        setInteractionsData(null);
    }

    const items = [
        {
            key: 'none',
            label: 'None',
            children: <div className="p-4" style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 12 }}>No interaction assigned.</div>
        },
        {
            key: 'audio',
            label: 'Audio',
            children: (
                <div className="flex flex-col gap-4 pt-2">
                    <ControlGroup label="Select Audio">
                        <Select
                            className="w-full h-8"
                            value={data.audioSrc}
                            onChange={(val) => updateData('audioSrc', val)}
                            options={[
                                { label: 'Custom URL...', value: '' },
                                ...audioList.map((a: any) => ({ label: a.name, value: a.src }))
                            ]}
                            placeholder="Pick from audio list"
                        />
                    </ControlGroup>
                    <ControlGroup label="Or Paste Audio URL">
                        <Input
                            value={data.audioSrc}
                            onChange={(e) => updateData('audioSrc', e.target.value)}
                            placeholder="https://example.com/audio.mp3"
                        />
                    </ControlGroup>
                    <div className="flex gap-4">
                        <Checkbox checked={data.loop} onChange={(e) => updateData('loop', e.target.checked)}>Loop</Checkbox>
                        <Checkbox checked={data.autoplay} onChange={(e) => updateData('autoplay', e.target.checked)}>Autoplay</Checkbox>
                    </div>
                </div>
            )
        },
        {
            key: 'page',
            label: 'Go to Page',
            children: (
                <div className="flex flex-col gap-4 pt-2">
                    <ControlGroup label="Select Page">
                        <Select
                            className="w-full h-8"
                            value={data.targetPageId}
                            onChange={(val) => updateData('targetPageId', val)}
                            options={[
                                { label: 'None', value: '' },
                                ...allpages?.pages?.map((p: any) => ({ label: p.title || `Page ${p.id}`, value: p.id }))
                            ]}
                            placeholder="Select a destination page"
                        />
                    </ControlGroup>
                </div>
            )
        },
        {
            key: 'link',
            label: 'Web Link',
            children: (
                <div className="flex flex-col gap-4 pt-2">
                    <ControlGroup label="Website URL">
                        <Input
                            value={data.url}
                            onChange={(e) => updateData('url', e.target.value)}
                            placeholder="https://google.com"
                        />
                    </ControlGroup>
                    <ControlGroup label="Target">
                        <Select
                            className="w-full h-8"
                            value={data.target}
                            onChange={(val) => updateData('target', val)}
                            options={[
                                { label: 'New Tab (_blank)', value: '_blank' },
                                { label: 'Same Tab (_self)', value: '_self' },
                            ]}
                        />
                    </ControlGroup>
                </div>
            )
        },
        {
            key: 'effect',
            label: 'Effects',
            children: (
                <div className="flex flex-col gap-4 pt-2">
                    <ControlGroup label="Select Effect">
                        <Select
                            className="w-full h-8"
                            value={data.effectValue} // Store the effect key/value
                            onChange={(val) => {
                                updateData('effectValue', val);
                            }}
                            options={effectsList.map((e: any) => ({ label: <span>{e.icon} {e.name}</span>, value: e.value }))}
                            placeholder="Select an effect"
                        />
                    </ControlGroup>

                    {!data.effectValue && (
                        <div className="mt-2" style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                            Select an effect to see it in action in Preview mode.
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'triggerAnim',
            label: 'Trigger Animation',
            children: (() => {
                const targetEl = data.triggerElementId
                    ? Data.find((el: any) => el.id === data.triggerElementId)
                    : null;

                return (
                    <div className="flex flex-col gap-4 pt-2">
                        {/* Target element picker */}
                        <ControlGroup label="Target Element">
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => setTriggerSelectionMode(true)}
                                    className="flex-1 transition-colors"
                                    style={{ height: 32, padding: '0 12px', borderRadius: 6, border: '1px dashed var(--accent-primary-border)', color: 'var(--accent-primary)', fontSize: 12, background: 'none', cursor: 'pointer' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-primary-light)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                >
                                    {data.triggerElementId ? 'Change element' : 'Pick from canvas'}
                                </button>
                                {data.triggerElementId && (
                                    <button
                                        onClick={() => updateData('triggerElementId', '')}
                                        className="transition-colors"
                                        style={{ height: 32, padding: '0 10px', borderRadius: 6, border: '1px solid var(--border-default)', color: 'var(--gray-400)', fontSize: 13, background: 'none', cursor: 'pointer' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--gray-400)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </ControlGroup>

                        {/* Animation preview stage */}
                        {targetEl && (
                            <div className="relative rounded-lg bg-gray-900 overflow-hidden" style={{ height: 148 }}>
                                {/* Stage grid */}
                                <div className="absolute inset-0 opacity-10"
                                    style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '20px 20px' }} />

                                {/* Animated element */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div ref={previewRef} className="flex items-center justify-center" style={{ maxWidth: '70%', maxHeight: '80%' }}>
                                        {targetEl.type === 'img' && (
                                            <img src={targetEl.src} alt="" style={{ maxWidth: 180, maxHeight: 110, objectFit: 'contain' }} />
                                        )}
                                        {targetEl.type === 'text' && (
                                            <div style={{
                                                ...targetEl.font,
                                                fontSize: 16,
                                                color: targetEl.font?.color || '#fff',
                                                textAlign: 'center',
                                                maxWidth: 260,
                                                wordBreak: 'break-word',
                                            }}>
                                                {targetEl.text || '(empty text)'}
                                            </div>
                                        )}
                                        {targetEl.type === 'audio' && (
                                            <div className="flex flex-col items-center gap-1 text-white/60">
                                                <i className="fa-solid fa-music text-3xl" />
                                                <span className="text-xs">Audio element</span>
                                            </div>
                                        )}
                                        {targetEl.type === 'group' && (
                                            <div className="flex flex-col items-center gap-1 text-white/60">
                                                <i className="fa-solid fa-object-group text-3xl" />
                                                <span className="text-xs">Group</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Replay button */}
                                <button
                                    onClick={playPreview}
                                    className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                                >
                                    <i className="fa-solid fa-rotate-right text-[10px]" /> Replay
                                </button>

                                {/* No-effect hint */}
                                {data.triggerAnimationConfig?.effect === 'none' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-white/30 text-xs">Pick an effect to preview</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Animation config — only shown after target is picked */}
                        {data.triggerElementId && (
                            <>
                                <ControlGroup label="Effect">
                                    <Select
                                        className="w-full h-8"
                                        value={data.triggerAnimationConfig?.effect}
                                        onChange={(val) => updateTriggerAnim('effect', val)}
                                        options={animationEffects}
                                    />
                                </ControlGroup>
                                <ControlGroup label="Direction">
                                    <Select
                                        className="w-full h-8"
                                        value={data.triggerAnimationConfig?.direction}
                                        onChange={(val) => updateTriggerAnim('direction', val)}
                                        options={animationDirections}
                                    />
                                </ControlGroup>
                                <ControlGroup label="Animation Direction">
                                    <Select
                                        className="w-full h-8"
                                        value={data.triggerAnimationConfig?.animationDirection}
                                        onChange={(val) => updateTriggerAnim('animationDirection', val)}
                                        options={playDirections}
                                    />
                                </ControlGroup>
                                <ControlGroup label="Transition Type">
                                    <Select
                                        className="w-full h-8"
                                        value={data.triggerAnimationConfig?.transitionType}
                                        onChange={(val) => updateTriggerAnim('transitionType', val)}
                                        options={animationEasingTypes}
                                    />
                                </ControlGroup>
                                <div className="flex gap-4">
                                    <ControlGroup label="Delay (s)">
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.1}
                                            value={data.triggerAnimationConfig?.delay}
                                            onChange={(e) => updateTriggerAnim('delay', Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </ControlGroup>
                                    <ControlGroup label="Speed (s)">
                                        <Input
                                            type="number"
                                            min={0.1}
                                            step={0.1}
                                            value={data.triggerAnimationConfig?.speed}
                                            onChange={(e) => updateTriggerAnim('speed', Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </ControlGroup>
                                </div>
                            </>
                        )}
                    </div>
                );
            })()
        }
    ];

    return (
        <Modal
            title="Configure Interaction"
            open={interaction?.elementIndex !== null && !interaction?.triggerSelectionMode}
            onOk={handleSave}
            onCancel={cancelHandler}
            // destroyOnClose
            zIndex={2000} // Ensure it's above everything
        >
            <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                    setActiveTab(key);
                    updateData('type', key);
                }}
                items={items}
            />
        </Modal>
    );
};

export default InteractionModal;
