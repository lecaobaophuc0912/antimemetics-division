import { locales } from '../i18n';
import { useI18n } from '../contexts/I18nContext';
import { getLocaleDisplayName } from '../utils/locale';
import { useState } from 'react';

export function LanguageSwitcher() {
    const { locale: currentLocale, setLocale } = useI18n();
    const [isChanging, setIsChanging] = useState(false);

    // Ensure locale is valid before rendering
    if (!currentLocale || !['en', 'vi'].includes(currentLocale)) {
        return null; // Don't render until locale is properly set
    }

    const handleLanguageChange = async (locale: string) => {
        if (locale === currentLocale || isChanging) return;

        setIsChanging(true);

        try {
            setLocale(locale);
            // Add a small delay to show the changing state
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Failed to change language:', error);
        } finally {
            setIsChanging(false);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm mr-1">Language:</span>
            {locales.map((locale) => {
                const isActive = currentLocale === locale;
                const isDisabled = isChanging && !isActive;

                return (
                    <button
                        key={locale}
                        onClick={() => handleLanguageChange(locale)}
                        disabled={isDisabled}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                            ? 'bg-green-500 text-white neon-glow shadow-lg'
                            : isDisabled
                                ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105'
                            } ${isChanging && !isActive ? 'animate-pulse' : ''}`}
                        title={`Switch to ${getLocaleDisplayName(locale)}`}
                    >
                        {isChanging && !isActive ? (
                            <span className="flex items-center space-x-1">
                                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                <span>{locale.toUpperCase()}</span>
                            </span>
                        ) : (
                            <>
                                {locale.toUpperCase()}
                                {isActive && <span className="ml-1">✓</span>}
                            </>
                        )}
                    </button>
                );
            })}
            {isChanging && (
                <span className="text-xs text-gray-400 animate-pulse">
                    Switching...
                </span>
            )}
        </div>
    );
} 