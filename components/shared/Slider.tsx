import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, onChange, min, max, step = 1, unit = '' }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <span className="text-sm font-semibold text-white bg-gray-600 px-2 py-0.5 rounded">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-blue"
      />
    </div>
  );
};
