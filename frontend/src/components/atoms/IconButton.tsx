import React from 'react';

interface IconButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    variant?: 'edit' | 'delete' | 'view' | 'default';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
    onClick,
    icon,
    variant = 'default',
    size = 'md',
    className = '',
}) => {
    const getVariantClasses = () => {
        const variantClasses = {
            edit: 'text-gray-400 hover:text-blue-400',
            delete: 'text-gray-400 hover:text-red-400',
            view: 'text-gray-400 hover:text-green-400',
            default: 'text-gray-400 hover:text-white'
        };
        return variantClasses[variant];
    };

    const getSizeClasses = () => {
        const sizeClasses = {
            sm: 'p-1',
            md: 'p-2',
            lg: 'p-3'
        };
        return sizeClasses[size];
    };

    const classes = `${getVariantClasses()} ${getSizeClasses()} transition-colors duration-200 ${className}`;

    return (
        <button onClick={onClick} className={classes}>
            {icon}
        </button>
    );
}; 