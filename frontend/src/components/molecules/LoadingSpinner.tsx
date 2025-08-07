import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center py-12">
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 neon-glow"></div>
                <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 animation-delay-2000 neon-glow-accent"></div>
            </div>
        </div>
    );
}; 