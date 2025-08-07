import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextIntlClientProvider } from 'next-intl';
import { locales, defaultLocale, loadMessages } from '../i18n';

interface I18nContextType {
    locale: string;
    setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

interface I18nProviderProps {
    children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const router = useRouter();
    const [locale, setLocaleState] = useState<string>(defaultLocale);
    const [messages, setMessages] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get locale from URL or use default
    useEffect(() => {
        const getLocaleFromPath = () => {
            const pathLocale = router.asPath.split('/')[1];
            return locales.includes(pathLocale as any) ? pathLocale : defaultLocale;
        };

        const currentLocale = getLocaleFromPath();
        setLocaleState(currentLocale);
    }, [router.asPath]);

    // Load messages when locale changes
    useEffect(() => {
        async function loadLocaleMessages() {
            setIsLoading(true);
            try {
                const localeMessages = await loadMessages(locale);
                setMessages(localeMessages);
            } catch (error) {
                console.error('Failed to load locale messages:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadLocaleMessages();
    }, [locale]);

    const setLocale = (newLocale: string) => {
        if (!locales.includes(newLocale as any)) {
            console.warn(`Locale ${newLocale} is not supported`);
            return;
        }

        // Update URL with new locale
        const currentPath = router.asPath;
        const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '') || '/';
        const newPath = `/${newLocale}${pathWithoutLocale}`;

        router.push(newPath);
    };

    if (isLoading || !messages) {
        return (
            <div className="min-h-screen cyber-grid bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin neon-glow"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin animation-delay-2000 neon-glow-accent"></div>
                </div>
            </div>
        );
    }

    return (
        <I18nContext.Provider value={{ locale, setLocale }}>
            <NextIntlClientProvider
                locale={locale}
                messages={messages}
                timeZone="Asia/Ho_Chi_Minh"
            >
                {children}
            </NextIntlClientProvider>
        </I18nContext.Provider>
    );
} 