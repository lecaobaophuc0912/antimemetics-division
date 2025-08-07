import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'priority' | 'status' | 'default';
    color?: 'red' | 'yellow' | 'green' | 'blue' | 'gray';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    color,
    className = '',
}) => {
    const getColorClasses = () => {
        if (color) {
            const colorClasses = {
                red: 'bg-red-500',
                yellow: 'bg-yellow-500',
                green: 'bg-green-500',
                blue: 'bg-blue-500',
                gray: 'bg-gray-500'
            };
            return colorClasses[color];
        }

        if (variant === 'priority') {
            return 'bg-yellow-500';
        }

        if (variant === 'status') {
            return 'bg-gray-500';
        }

        return 'bg-gray-500';
    };

    const classes = `px-3 py-1 rounded-full text-xs font-semibold text-white ${getColorClasses()} ${className}`;

    return (
        <span className={classes}>
            {children}
        </span>
    );
}; 