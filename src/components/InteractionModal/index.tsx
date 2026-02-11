import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Input, Checkbox, Select } from 'antd';
import { ControlGroup } from '../ui/controls';
import { defaultInteractionConfig } from '@/utils/config/defaults';
import { audioList } from '@/utils/config/audioList';
import { effectsList } from '@/utils/config/effectsList';
import useStoreconfig from '@/store';

interface InteractionModalProps {
    open: boolean;
    onCancel: () => void;
    onSave: (interactionData: any) => void;
    initialData?: any;
}

const InteractionModal = ({ open, onCancel, onSave, initialData }: InteractionModalProps) => {
    const { allpages } = useStoreconfig();
    const [data, setData] = useState(initialData || defaultInteractionConfig);
    const [activeTab, setActiveTab] = useState('none');

    useEffect(() => {
        if (open) {
            setData(initialData || defaultInteractionConfig);
            setActiveTab(initialData?.type || 'none');
        }
    }, [open, initialData]);

    const updateData = (key: string, value: any) => {
        setData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave({ ...data, type: activeTab });
        onCancel();
    };

    const items = [
        {
            key: 'none',
            label: 'None',
            children: <div className="p-4 text-gray-500 italic">No interaction assigned.</div>
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
                        <div className="mt-2 text-gray-400 text-sm">
                            Select an effect to see it in action in Preview mode.
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <Modal
            title="Configure Interaction"
            open={open}
            onOk={handleSave}
            onCancel={onCancel}
            destroyOnClose
            zIndex={2000} // Ensure it's above everything
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
            />
        </Modal>
    );
};

export default InteractionModal;
