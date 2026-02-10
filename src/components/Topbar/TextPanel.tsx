import React from 'react';
import { ColorControl, ControlGroup, InputControl, SelectControl, SliderControl, Label } from '../ui/controls';
import { fontFamilies } from '@/utils/config/defaults';
import useStoreconfig from '@/store';

interface TextPanelProps {
    item: any;
}

const TextPanel = ({ item }: TextPanelProps) => {
    const { editor, updateEditor } = useStoreconfig()

    const updateFont = (key: string, value: any) => {
        updateEditor(editor?.elementsList?.map((i: any) => {
            if (i.id === editor?.selectedElementId) {
                return {
                    ...i,
                    font: {
                        ...i.font,
                        [key]: value
                    }
                };
            }
            return i;
        })
        )
    };

    const updateText = (val: string) => {
        updateEditor(editor?.elementsList?.map((i: any) => {
            if (i.id === editor?.selectedElementId) {
                return { ...i, text: val };
            }
            return i;
        })
        )
    }

    if (!item) return null;

    return (
        <div className="flex flex-wrap gap-4 items-center">

            {/* Content Content*/}
            <ControlGroup label="Content">
                <textarea
                    className='border border-gray-300 text-[10px] rounded p-1 w-40 h-8 resize-none'
                    value={item.text}
                    onChange={(e) => updateText(e.target.value)}
                />
            </ControlGroup>

            <ControlGroup label="Font Family">
                <SelectControl
                    width="w-32"
                    value={item.font?.fontFamily}
                    onChange={(val) => updateFont('fontFamily', val)}
                    options={fontFamilies.map(f => ({ label: f, value: f }))}
                />
            </ControlGroup>

            <ControlGroup label="Size (vw)">
                {/* Using input for precise VW control, or could use slider if we set range */}
                <InputControl
                    width="w-16"
                    type="number"
                    value={item.font?.fontSize}
                    onChange={(val) => updateFont('fontSize', val)}
                />
            </ControlGroup>

            <ControlGroup label="Weight">
                <SelectControl
                    width="w-24"
                    value={item.font?.fontWeight}
                    onChange={(val) => updateFont('fontWeight', val)}
                    options={[
                        { label: "Normal", value: "normal" },
                        { label: "Bold", value: "bold" },
                        { label: "Thin (100)", value: "100" },
                        { label: "Light (300)", value: "300" },
                        { label: "Medium (500)", value: "500" },
                        { label: "Bold (700)", value: "700" },
                        { label: "Black (900)", value: "900" },
                    ]}
                />
            </ControlGroup>

            <ControlGroup label="Style">
                <SelectControl
                    width="w-24"
                    value={item.font?.fontStyle}
                    onChange={(val) => updateFont('fontStyle', val)}
                    options={[
                        { label: "Normal", value: "normal" },
                        { label: "Italic", value: "italic" },
                        { label: "Oblique", value: "oblique" },
                    ]}
                />
            </ControlGroup>

            <ControlGroup label="Decoration">
                <SelectControl
                    width="w-24"
                    value={item.font?.textDecoration}
                    onChange={(val) => updateFont('textDecoration', val)}
                    options={[
                        { label: "None", value: "none" },
                        { label: "Underline", value: "underline" },
                        { label: "Overline", value: "overline" },
                        { label: "Line Through", value: "line-through" },
                    ]}
                />
            </ControlGroup>

            <ControlGroup label="Color">
                <ColorControl
                    value={item.font?.color}
                    onChange={(val) => updateFont('color', val)}
                />
            </ControlGroup>

            <ControlGroup label="Align">
                <SelectControl
                    width="w-24"
                    value={item.font?.textAlign}
                    onChange={(val) => updateFont('textAlign', val)}
                    options={[
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                        { label: "Justify", value: "justify" },
                    ]}
                />
            </ControlGroup>

            <ControlGroup label="Line Height">
                <InputControl
                    width="w-16"
                    type="number"
                    value={item.font?.lineHeight}
                    onChange={(val) => updateFont('lineHeight', val)}
                />
            </ControlGroup>

        </div>
    );
};

export default TextPanel;
