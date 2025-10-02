import React, { useState, useMemo } from 'react';

export interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    fallback?: React.ReactNode;
    defaultText?: string;
    onClick?: () => void;
    showBorder?: boolean;
    rounded?: 'full' | 'lg' | 'md' | 'sm';
}

const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

const roundedClasses = {
    full: 'rounded-full',
    lg: 'rounded-lg',
    md: 'rounded-md',
    sm: 'rounded-sm',
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'Avatar',
    size = 'md',
    className = '',
    fallback,
    defaultText,
    onClick,
    showBorder = false,
    rounded = 'full',
}) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Determine if the source is base64 or URL
    const isBase64 = useMemo(() => {
        if (!src) return false;
        return src.startsWith('data:image/');
    }, [src]);

    // Handle image load success
    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    // Handle image load error
    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    // Generate fallback content
    const renderFallback = () => {
        if (fallback) return fallback;

        if (defaultText) {
            return (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                    <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                        {defaultText.charAt(0).toUpperCase()}
                    </span>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-400 dark:text-gray-500 font-semibold text-sm">
                    ?
                </span>
            </div>
        );
    };

    // Render the avatar content
    const renderAvatarContent = () => {
        // If no source or image error, show fallback
        if (!src || imageError) {
            return renderFallback();
        }

        // If base64, render directly
        if (isBase64) {
            return (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            );
        }

        // If URL, render with error handling
        return (
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
            />
        );
    };

    const baseClasses = `
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    ${showBorder ? 'ring-2 ring-gray-200 dark:ring-gray-600' : ''}
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    overflow-hidden
    bg-gray-100 dark:bg-gray-800
    flex-shrink-0
  `;

    return (
        <div
            className={`${baseClasses} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {renderAvatarContent()}

            {/* Loading overlay */}
            {imageLoading && src && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
        </div>
    );
};

export default Avatar;
