import React from 'react';

interface InputProps {
    type?: 'text' | 'email' | 'password' | 'date' | 'number';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    type = 'text',
    value,
    onChange,
    placeholder,
    label,
    required = false,
    disabled = false,
    className = '',
}) => {
    const inputClasses = `w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`;

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={inputClasses}
            />
        </div>
    );
}; 