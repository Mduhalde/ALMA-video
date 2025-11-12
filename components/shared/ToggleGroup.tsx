import React from 'react';

interface ToggleGroupProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({ label, options, value, onChange }) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-400 mb-2 block">{label}</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors text-center
              ${value === option.value
                ? 'bg-brand-blue text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
