import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
}) => {
    const baseClasses = 'font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl rounded-xl';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800',
        success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800',
        ghost: 'bg-transparent text-gray-400 hover:text-blue-400 border border-gray-600/50 hover:border-blue-500/50'
    };

    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg'
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {children}
        </button>
    );
}; 