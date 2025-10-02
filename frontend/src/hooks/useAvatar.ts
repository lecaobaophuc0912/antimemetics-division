import { useMemo } from 'react';

export interface AvatarSource {
    src: string | null;
    isBase64: boolean;
    isUrl: boolean;
    isExternal: boolean;
    displaySrc: string | null;
}

export interface UseAvatarOptions {
    avatarUrl?: string | null;
    apiBaseUrl?: string;
    fallbackSrc?: string;
}

export const useAvatar = ({
    avatarUrl,
    apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    fallbackSrc,
}: UseAvatarOptions): AvatarSource => {
    const avatarSource = useMemo((): AvatarSource => {
        if (!avatarUrl) {
            return {
                src: fallbackSrc || null,
                isBase64: false,
                isUrl: false,
                isExternal: false,
                displaySrc: fallbackSrc || null,
            };
        }

        // Check if it's a base64 image
        const isBase64 = avatarUrl.startsWith('data:image/');

        if (isBase64) {
            return {
                src: avatarUrl,
                isBase64: true,
                isUrl: false,
                isExternal: false,
                displaySrc: avatarUrl,
            };
        }

        // Check if it's an external URL
        const isExternal = avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://');

        if (isExternal) {
            return {
                src: avatarUrl,
                isBase64: false,
                isUrl: true,
                isExternal: true,
                displaySrc: avatarUrl,
            };
        }

        // It's a relative path, construct full URL
        const fullUrl = avatarUrl.startsWith('/')
            ? `${apiBaseUrl.replace('/api', '')}${avatarUrl}`
            : `${apiBaseUrl.replace('/api', '')}/${avatarUrl}`;

        return {
            src: avatarUrl,
            isBase64: false,
            isUrl: true,
            isExternal: false,
            displaySrc: fullUrl,
        };
    }, [avatarUrl, apiBaseUrl, fallbackSrc]);

    return avatarSource;
};

export default useAvatar;
