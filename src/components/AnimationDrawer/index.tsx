import React, { useState, useEffect } from 'react';
import { Drawer, Segmented } from 'antd';
import { ControlGroup, SelectControl, SliderControl, InputControl, Label } from '../ui/controls';
import { defaultAnimationConfig, animationEffects, animationDirections, playDirections, animationEasingTypes } from '@/utils/config/defaults';

interface AnimationDrawerProps {
    open: boolean;
    onClose: () => void;
    onSave: (animationData: any) => void;
    initialData?: any;
}

const AnimationDrawer = ({ open, onClose, onSave, initialData }: AnimationDrawerProps) => {
    const [data, setData] = useState(initialData || defaultAnimationConfig);
    const [activeCategory, setActiveCategory] = useState<string>('entrance');

    useEffect(() => {
        if (open) {
            setData(initialData || defaultAnimationConfig);
        }
    }, [open, initialData]);

    const updateAnimation = (category: string, key: string, value: any) => {
        const newData = {
            ...data,
            [category]: {
                ...data[category],
                [key]: value
            },
            // Add a trigger for preview
            previewTrigger: Date.now(),
            previewCategory: category
        };
        setData(newData);
        onSave(newData); // Save on every change for live preview
    };

    const handleClose = () => {
        onClose();
    };

    const categories = [
        { value: 'entrance', label: 'Entrance' },
        { value: 'continuous', label: 'Continuous' },
        // { value: 'exit', label: 'Exit' },
        { value: 'hover', label: 'Hover' },
        { value: 'click', label: 'Click' },
    ];

    const settings = data[activeCategory] || { effect: 'none', direction: 'none', animationDirection: 'normal', transitionType: 'ease', delay: 0, speed: 1 };

    return (
        <Drawer
            title="Animations"
            placement="right"
            onClose={handleClose}
            open={open}
            width={320}
            rootStyle={{
                backgroundColor: "#ffffff01",
                backdropFilter: "blur(0px)",
            }}
            styles={
                {
                    mask: {
                        backgroundColor: "#ffffff01",
                        backdropFilter: "blur(0px)",
                    }
                }
            }
        >
            <div className="flex flex-col gap-6 h-full">
                <div className="border-b pb-4">
                    <Label>Category</Label>
                    <Segmented
                        block
                        value={activeCategory}
                        onChange={(val) => setActiveCategory(val as string)}
                        options={categories}
                        className="mt-1"
                    />
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <ControlGroup label="Effect">
                        <SelectControl
                            width="w-full"
                            value={settings.effect}
                            onChange={(val) => updateAnimation(activeCategory, 'effect', val)}
                            options={animationEffects}
                        />
                    </ControlGroup>

                    <ControlGroup label="Direction">
                        <SelectControl
                            width="w-full"
                            value={settings.direction}
                            onChange={(val) => updateAnimation(activeCategory, 'direction', val)}
                            options={animationDirections}
                        />
                    </ControlGroup>

                    <ControlGroup label="Animation Direction">
                        <SelectControl
                            width="w-full"
                            value={settings.animationDirection}
                            onChange={(val) => updateAnimation(activeCategory, 'animationDirection', val)}
                            options={playDirections}
                        />
                    </ControlGroup>

                    <ControlGroup label="Transition Type">
                        <SelectControl
                            width="w-full"
                            value={settings.transitionType}
                            onChange={(val) => updateAnimation(activeCategory, 'transitionType', val)}
                            options={animationEasingTypes}
                        />
                    </ControlGroup>

                    <ControlGroup label="Delay (s)">
                        <InputControl
                            width="full"
                            type="number"
                            value={settings.delay}
                            onChange={(val) => updateAnimation(activeCategory, 'delay', Number(val))}
                        />
                    </ControlGroup>

                    <ControlGroup label="Animation Speed">
                        <SliderControl
                            width="w-full"
                            value={settings.speed}
                            onChange={(val) => updateAnimation(activeCategory, 'speed', val)}
                            min={0}
                            max={10}
                            step={0.1}
                            unit="s"
                        />
                    </ControlGroup>
                </div>
            </div>
        </Drawer>
    );
};

export default AnimationDrawer;
