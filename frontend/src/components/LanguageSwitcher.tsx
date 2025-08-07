import { locales } from '../i18n';
import { useI18n } from '../contexts/I18nContext';

export function LanguageSwitcher() {
    const { locale: currentLocale, setLocale } = useI18n();

    const handleLanguageChange = (locale: string) => {
        setLocale(locale);
    };

    return (
        <div className="flex items-center space-x-2">
            {locales.map((locale) => (
                <button
                    key={locale}
                    onClick={() => handleLanguageChange(locale)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${currentLocale === locale
                            ? 'bg-green-500 text-white neon-glow'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                >
                    {locale.toUpperCase()}
                </button>
            ))}
        </div>
    );
} 