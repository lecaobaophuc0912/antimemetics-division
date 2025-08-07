import React from 'react';

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="mb-6 p-4 border border-red-600 rounded-xl bg-red-100 text-red-800 shadow-lg">
            <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">SYSTEM ERROR: {message}</span>
            </div>
        </div>
    );
}; 