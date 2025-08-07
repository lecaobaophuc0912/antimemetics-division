import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    hover = true,
}) => {
    const baseClasses = 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6';
    const hoverClasses = hover ? 'hover:border-gray-600/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl' : '';
    const classes = `${baseClasses} ${hoverClasses} ${className}`;

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
}; 