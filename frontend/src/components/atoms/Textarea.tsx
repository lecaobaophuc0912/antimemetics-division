import React from 'react';

interface TextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    label?: string;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    value,
    onChange,
    placeholder,
    label,
    rows = 3,
    required = false,
    disabled = false,
    className = '',
}) => {
    const textareaClasses = `w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`;

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                required={required}
                disabled={disabled}
                className={textareaClasses}
            />
        </div>
    );
}; 