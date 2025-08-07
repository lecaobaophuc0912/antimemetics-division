import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'vi'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

// Load messages for a specific locale
export async function loadMessages(locale: string) {
    try {
        const messages = await import(`../i18n/${locale}.json`);
        return messages.default;
    } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        // Fallback to English if locale not found
        const fallbackMessages = await import(`../i18n/en.json`);
        return fallbackMessages.default;
    }
} 