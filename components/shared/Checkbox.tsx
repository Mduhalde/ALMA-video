import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const id = `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-brand-blue focus:ring-brand-blue"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-300">
        {label}
      </label>
    </div>
  );
};
