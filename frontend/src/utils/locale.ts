import { locales, defaultLocale, type Locale } from '../i18n';

const LOCALE_STORAGE_KEY = 'antimemetics-preferred-locale';

/**
 * Get the stored locale preference from localStorage
 */
export const getStoredLocale = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch (error) {
        console.warn('Failed to read locale from localStorage:', error);
        return null;
    }
};

/**
 * Store locale preference in localStorage and cookies
 */
export const storeLocale = (locale: string): void => {
    if (typeof window === 'undefined') return;
    try {
        // Store in localStorage
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);

        // Store in cookie for middleware access
        document.cookie = `antimemetics-preferred-locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch (error) {
        console.warn('Failed to store locale:', error);
    }
};

/**
 * Get user's preferred locale from various sources
 */
export const getPreferredLocale = (): string => {
    // First priority: stored locale
    const storedLocale = getStoredLocale();
    if (storedLocale && locales.includes(storedLocale as Locale)) {
        return storedLocale;
    }

    // Second priority: browser language
    if (typeof window !== 'undefined') {
        const browserLocale = navigator.language.split('-')[0];
        if (locales.includes(browserLocale as Locale)) {
            return browserLocale;
        }
    }

    // Fallback: default locale
    return defaultLocale;
};

/**
 * Check if a locale is supported
 */
export const isValidLocale = (locale: string): locale is Locale => {
    return locales.includes(locale as Locale);
};

/**
 * Get locale display name
 */
export const getLocaleDisplayName = (locale: string): string => {
    const displayNames: Record<string, string> = {
        'en': 'English',
        'vi': 'Tiếng Việt'
    };
    return displayNames[locale] || locale.toUpperCase();
};

/**
 * Clear stored locale preference
 */
export const clearStoredLocale = (): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(LOCALE_STORAGE_KEY);
        document.cookie = 'antimemetics-preferred-locale=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (error) {
        console.warn('Failed to clear stored locale:', error);
    }
}; 