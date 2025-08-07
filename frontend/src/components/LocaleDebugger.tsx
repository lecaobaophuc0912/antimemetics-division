import { useI18n } from '../contexts/I18nContext';
import { getStoredLocale, clearStoredLocale } from '../utils/locale';
import { useState, useEffect } from 'react';

interface LocaleDebuggerProps {
    show?: boolean;
}

export function LocaleDebugger({ show = false }: LocaleDebuggerProps) {
    const { locale } = useI18n();
    const [storedLocale, setStoredLocale] = useState<string | null>(null);
    const [cookies, setCookies] = useState<string>('');
    const [urlPath, setUrlPath] = useState<string>('');

    useEffect(() => {
        // Update stored locale info
        setStoredLocale(getStoredLocale());

        // Get cookies
        if (typeof document !== 'undefined') {
            setCookies(document.cookie);
        }

        // Get current URL path
        if (typeof window !== 'undefined') {
            setUrlPath(window.location.pathname);
        }
    }, [locale]);

    const handleClearStoredLocale = () => {
        clearStoredLocale();
        setStoredLocale(null);
        setCookies(document.cookie);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 border border-green-500/30 rounded-lg p-4 text-xs text-green-400 max-w-sm">
            <h4 className="font-bold mb-2 text-green-300">🔧 Locale Debug Info</h4>
            <div className="space-y-1">
                <div><strong>Current Locale:</strong> {locale}</div>
                <div><strong>Locale Type:</strong> {typeof locale}</div>
                <div><strong>Stored Locale:</strong> {storedLocale || 'None'}</div>
                <div><strong>Browser Language:</strong> {typeof navigator !== 'undefined' ? navigator.language : 'N/A'}</div>
                <div><strong>URL Path:</strong> {urlPath}</div>
                <div><strong>Cookie:</strong> {cookies.includes('antimemetics-preferred-locale') ? '✓' : '✗'}</div>
                <div><strong>Valid Locale:</strong> {['en', 'vi'].includes(locale) ? '✓' : '✗'}</div>
            </div>
            <button
                onClick={handleClearStoredLocale}
                className="mt-2 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-red-300 text-xs transition-colors"
            >
                Clear Stored Locale
            </button>
        </div>
    );
} 