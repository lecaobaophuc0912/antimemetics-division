import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const Select: React.FC<SelectProps> = ({
    value,
    onChange,
    options,
    label,
    required = false,
    disabled = false,
    className = '',
}) => {
    const selectClasses = `w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`;

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={selectClasses}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}; 