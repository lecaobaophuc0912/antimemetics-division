import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextIntlClientProvider } from 'next-intl';
import { locales, defaultLocale, loadMessages } from '../i18n';
import { getStoredLocale, storeLocale, isValidLocale } from '../utils/locale';

interface I18nContextType {
    locale: string;
    setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
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
    const [hasInitialized, setHasInitialized] = useState(false);

    // Ensure locale is always valid
    const safeLocale = locales.includes(locale as any) ? locale : defaultLocale;

    // Initialize locale from URL, localStorage, or default
    useEffect(() => {
        if (hasInitialized) return;

        const getInitialLocale = () => {
            // First priority: URL locale
            const pathLocale = router.asPath.split('/')[1];
            if (locales.includes(pathLocale as any)) {
                return pathLocale;
            }

            // Second priority: stored locale
            const storedLocale = getStoredLocale();
            if (storedLocale && locales.includes(storedLocale as any)) {
                return storedLocale;
            }

            // Fallback: default locale
            return defaultLocale;
        };

        const initialLocale = getInitialLocale();
        setLocaleState(initialLocale);
        setHasInitialized(true);

        // If URL doesn't match the determined locale, redirect
        const pathLocale = router.asPath.split('/')[1];
        if (!locales.includes(pathLocale as any) || pathLocale !== initialLocale) {
            // Handle both actual locale codes and dynamic route parameters like [locale]
            let currentPath = router.asPath;

            // Remove locale from path if it exists
            if (locales.includes(pathLocale as any)) {
                // If the first segment is a valid locale, remove it
                currentPath = router.asPath.replace(/^\/[a-z]{2}/, '') || '/';
            } else if (pathLocale && pathLocale.startsWith('[') && pathLocale.endsWith(']')) {
                // If the first segment is a dynamic route parameter like [locale], remove it
                currentPath = router.asPath.replace(/^\/\[[^\]]+\]/, '') || '/';
            }

            const newPath = `/${initialLocale}${currentPath}`;
            router.replace(newPath);
        }
    }, [router.asPath, hasInitialized, router]);

    // Update locale when URL changes (after initialization)
    useEffect(() => {
        if (!hasInitialized) return;

        const getLocaleFromPath = () => {
            const pathLocale = router.asPath.split('/')[1];
            return locales.includes(pathLocale as any) ? pathLocale : defaultLocale;
        };

        const currentLocale = getLocaleFromPath();
        if (currentLocale !== locale) {
            setLocaleState(currentLocale);
            storeLocale(currentLocale);
        }
    }, [router.asPath, hasInitialized, locale]);

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
        if (!isValidLocale(newLocale)) {
            console.warn(`Locale ${newLocale} is not supported`);
            return;
        }

        // Store the preference
        storeLocale(newLocale);

        // Update URL with new locale
        const currentPath = router.asPath;
        const pathLocale = currentPath.split('/')[1];

        // Handle both actual locale codes and dynamic route parameters like [locale]
        let pathWithoutLocale = currentPath;
        if (locales.includes(pathLocale as any)) {
            // If the first segment is a valid locale, remove it
            pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '') || '/';
        } else if (pathLocale && pathLocale.startsWith('[') && pathLocale.endsWith(']')) {
            // If the first segment is a dynamic route parameter like [locale], remove it
            pathWithoutLocale = currentPath.replace(/^\/\[[^\]]+\]/, '') || '/';
        }

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
        <I18nContext.Provider value={{ locale: safeLocale, setLocale }}>
            <NextIntlClientProvider
                locale={safeLocale}
                messages={messages}
                timeZone="Asia/Ho_Chi_Minh"
            >
                {children}
            </NextIntlClientProvider>
        </I18nContext.Provider>
    );
} 