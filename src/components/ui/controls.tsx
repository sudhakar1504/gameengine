import React from 'react';

// --- Labels ---
export const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <label className={`ctrl-label ${className}`}>
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
                className="ctrl-range flex-1"
            />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 32, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
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
        className={`ctrl-select ${width}`}
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
    <div className="flex items-center gap-1.5">
        <input
            type="color"
            style={{ width: 28, height: 28, padding: 2, border: '1px solid var(--border-default)', borderRadius: 'var(--control-radius)', cursor: 'pointer', background: 'none' }}
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
        />
        <input
            type="text"
            className="ctrl-input uppercase"
            style={{ width: 72 }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

interface InputProps {
    value: string | number;
    onChange: (val: string) => void;
    type?: "text" | "number";
    width?: string;
    placeholder?: string;
}

export const InputControl = ({ value, onChange, type = "text", width = "w-full", placeholder }: InputProps) => (
    <input
        type={type}
        className={`ctrl-input ${width}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
    />
);

interface ToggleProps {
    value: boolean;
    onChange: (val: boolean) => void;
    label?: string;
    iconOn?: React.ReactNode;
    iconOff?: React.ReactNode;
}

export const ToggleControl = ({ value, onChange, iconOn, iconOff }: ToggleProps) => (
    <button
        onClick={() => onChange(!value)}
        className={`btn-toggle ${value ? 'active' : ''}`}
    >
        {value ? (iconOn || "ON") : (iconOff || "OFF")}
    </button>
);
