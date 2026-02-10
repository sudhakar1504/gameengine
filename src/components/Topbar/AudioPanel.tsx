import React, { useMemo } from 'react';
import { ControlGroup, SliderControl, ToggleControl } from '../ui/controls';
import useStoreconfig from '@/store';

interface AudioPanelProps {
    item: any;
}

const AudioPanel = ({ item }: AudioPanelProps) => {
    const { updateEditor, editor } = useStoreconfig()

    const updateAudio = (key: string, value: any) => {
        updateEditor(editor?.elementsList?.map((i: any) => {
            if (i.id === editor?.selectedElementId) {
                return {
                    ...i,
                    audio: {
                        ...(i.audio || {}),
                        [key]: value
                    }
                };
            }
            return i;
        })
        )
    };

    const config = useMemo(() => {
        return item.audio || { loop: false, autoplay: false, volume: 100 };
    }, [item.audio]);

    return (
        <div className="flex flex-wrap gap-6 items-center">
            <ControlGroup label="Loop">
                <ToggleControl
                    value={config.loop}
                    onChange={(val) => updateAudio('loop', val)}
                    iconOn={<i className="fa-solid fa-repeat"></i>}
                    iconOff={<i className="fa-solid fa-arrow-right"></i>}
                />
            </ControlGroup>

            <ControlGroup label="Autoplay">
                <ToggleControl
                    value={config.autoplay}
                    onChange={(val) => updateAudio('autoplay', val)}
                    iconOn={<i className="fa-solid fa-play"></i>}
                    iconOff={<i className="fa-solid fa-stop"></i>}
                />
            </ControlGroup>

            <ControlGroup label="Volume">
                <SliderControl
                    value={config.volume}
                    onChange={(val) => updateAudio('volume', val)}
                    min={0} max={100} unit="%"
                />
            </ControlGroup>
        </div>
    );
};

export default AudioPanel;
