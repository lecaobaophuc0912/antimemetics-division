import React from 'react';

interface MessageTextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    className?: string;
}

export const MessageTextarea: React.FC<MessageTextareaProps> = ({
    value,
    onChange,
    placeholder,
    rows = 3,
    disabled = false,
    className = '',
}) => {
    const textareaClasses = `w-full px-4 py-3 mx-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
 ${className}`;

    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={textareaClasses}
        />
    );
}; 