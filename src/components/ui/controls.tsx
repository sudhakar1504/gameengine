import React from 'react';

// --- Labels ---
export const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <label className={`text-[10px] font-medium text-gray-500 mb-1 block ${className}`}>
        {children}
    </label>
);

// --- Wrappers ---
export const ControlGroup = ({ label, children, className = "" }: { label: string, children: React.ReactNode, className?: string }) => (
    <div className={`flex flex-col ${className}`}>
        <Label>{label}</Label>
        {children}
    </div>
);


// --- Inputs ---

interface SliderProps {
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    width?: string;
}

export const SliderControl = ({ value, onChange, min = 0, max = 100, step = 1, unit = "", width = "w-32" }: SliderProps) => {
    return (
        <div className={`flex items-center gap-2 ${width}`}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
                {value}{unit}
            </span>
        </div>
    );
};

interface SelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { label: string; value: string }[];
    width?: string;
}

export const SelectControl = ({ value, onChange, options, width = "w-24" }: SelectProps) => (
    <select
        className={`border border-gray-300 text-[10px] rounded p-1 ${width} bg-white focus:outline-none focus:border-blue-500`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
    >
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);

interface ColorProps {
    value: string;
    onChange: (val: string) => void;
}

export const ColorControl = ({ value, onChange }: ColorProps) => (
    <div className="flex items-center gap-1">
        <input
            type="color"
            className="w-6 h-6 p-0 border-0 rounded cursor-pointer overflow-hidden shadow-sm"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
        />
        <input
            type="text"
            className="border border-gray-300 text-[10px] rounded p-1 w-16 uppercase"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

interface InputProps {
    value: string | number;
    onChange: (val: string) => void; // Parent can parse number if needed
    type?: "text" | "number";
    width?: string;
    placeholder?: string;
}

export const InputControl = ({ value, onChange, type = "text", width = "w-full", placeholder }: InputProps) => (
    <input
        type={type}
        className={`border border-gray-300 text-[10px] rounded p-1 ${width} focus:outline-none focus:border-blue-500`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
    />
);

interface ToggleProps {
    value: boolean;
    onChange: (val: boolean) => void;
    label?: string; // Optional label next to icon?
    iconOn?: React.ReactNode;
    iconOff?: React.ReactNode;
}

export const ToggleControl = ({ value, onChange, iconOn, iconOff }: ToggleProps) => (
    <button
        onClick={() => onChange(!value)}
        className={`w-8 h-8 rounded flex items-center justify-center border transition-colors ${value ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
    >
        {value ? (iconOn || "ON") : (iconOff || "OFF")}
    </button>
);
