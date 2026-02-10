import React, { useMemo } from 'react';
import { ControlGroup, SliderControl, ToggleControl } from '../ui/controls';
import useStoreconfig from '@/store';

interface ImagePanelProps {
    item: any;
}

const ImagePanel = ({ item }: ImagePanelProps) => {
    const { updateEditor, editor } = useStoreconfig()

    const updateFilter = (key: string, value: any) => {
        updateEditor(editor?.elementsList?.map((i: any) => {
            if (i.id === editor?.selectedElementId) {
                return {
                    ...i,
                    filter: {
                        ...(i.filter || {}),
                        [key]: value
                    }
                };
            }
            return i;
        })
        )
    };

    const updateTransform = (key: string, value: any) => {
        updateEditor(editor?.elementsList?.map((i: any) => {
            if (i.id === editor?.selectedElementId) {
                return {
                    ...i,
                    transform: {
                        ...(i.transform || {}),
                        [key]: value
                    }
                };
            }
            return i;
        })
        )
    };

    // Ensure defaults exist if new
    const filters = useMemo(() => {
        return item.filter || { opacity: 100, brightness: 100, contrast: 100, saturate: 100, blur: 0 };
    }, [item.filter]);
    const transforms = useMemo(() => {
        return item.transform || { flipX: false, flipY: false };
    }, [item.transform]);

    return (
        <div className="flex flex-wrap gap-6 items-center">

            {/* Transforms */}
            <div className="flex gap-2 border-r border-gray-300 pr-4">
                <ControlGroup label="Flip X">
                    <ToggleControl
                        value={transforms.flipX}
                        onChange={(val) => updateTransform('flipX', val)}
                        iconOn={<i className="fa-solid fa-arrows-left-right-to-line"></i>}
                        iconOff={<i className="fa-solid fa-arrows-left-right"></i>}
                    />
                </ControlGroup>
                <ControlGroup label="Flip Y">
                    <ToggleControl
                        value={transforms.flipY}
                        onChange={(val) => updateTransform('flipY', val)}
                        iconOn={<i className="fa-solid fa-down-left-and-up-right-to-center"></i>} // Placeholder icon
                        iconOff={<i className="fa-solid fa-arrows-up-down"></i>}
                    />
                </ControlGroup>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <ControlGroup label="Opacity">
                    <div className="flex items-center gap-2">
                        <SliderControl
                            value={filters.opacity}
                            onChange={(val) => updateFilter('opacity', val)}
                            min={0} max={100} unit="%"
                        />
                    </div>
                </ControlGroup>

                <ControlGroup label="Brightness">
                    <SliderControl
                        value={filters.brightness}
                        onChange={(val) => updateFilter('brightness', val)}
                        min={0} max={200} unit="%"
                    />
                </ControlGroup>

                <ControlGroup label="Contrast">
                    <SliderControl
                        value={filters.contrast}
                        onChange={(val) => updateFilter('contrast', val)}
                        min={0} max={200} unit="%"
                    />
                </ControlGroup>

                <ControlGroup label="Saturation">
                    <SliderControl
                        value={filters.saturate}
                        onChange={(val) => updateFilter('saturate', val)}
                        min={0} max={200} unit="%"
                    />
                </ControlGroup>

                <ControlGroup label="Blur">
                    <SliderControl
                        value={filters.blur}
                        onChange={(val) => updateFilter('blur', val)}
                        min={0} max={20} unit="px"
                    />
                </ControlGroup>
            </div>

        </div>
    );
};

export default ImagePanel;
