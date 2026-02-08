import React from 'react';
import { ControlGroup, SliderControl, ToggleControl } from '../ui/controls';

interface AudioPanelProps {
    item: any;
    setData: (data: any) => void;
    id: string;
}

const AudioPanel = ({ item, setData, id }: AudioPanelProps) => {

    const updateAudio = (key: string, value: any) => {
        setData((prevData: any) => {
            return prevData.map((d: any) => {
                if (d.id === id) {
                    return {
                        ...d,
                        audio: {
                            ...(d.audio || {}),
                            [key]: value
                        }
                    };
                }
                return d;
            });
        });
    };

    const config = item.audio || { loop: false, autoplay: false, volume: 100 };

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
