import React from 'react';

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-xl text-red-200">
            {message}
        </div>
    );
}; 