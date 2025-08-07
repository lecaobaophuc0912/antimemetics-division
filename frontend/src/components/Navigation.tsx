import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '../contexts/I18nContext';
import { useNavigationTranslations, useCommonTranslations } from '../hooks/useTranslations';

interface NavigationProps {
  user?: {
    email: string;
  } | null;
  logout: () => void;
}

export function Navigation({ user, logout }: NavigationProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const t = useNavigationTranslations();
  const tc = useCommonTranslations();

  const isActive = (path: string) => {
    return router.pathname === `/${locale}${path}` || router.pathname === path;
  };

  return (
    <nav className="glass border-b border-green-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg flex items-center justify-center neon-glow">
              <Image
                src="/antimemetics-division-logo.png"
                alt={tc('antimemeticsLogo')}
                width={24}
                height={24}
                className="object-contain filter brightness-110 contrast-125"
              />
            </div>
            <span className="text-lg font-bold gradient-text">
              {tc('antimemeticsDivision')}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={`/${locale}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/')
                ? 'bg-green-600 text-white neon-glow'
                : 'text-green-300 hover:text-green-200 hover:bg-green-900/50'
                }`}
            >
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/todos`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/todos')
                ? 'bg-cyan-600 text-white neon-glow-accent'
                : 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-900/50'
                }`}
            >
              {t('todos')}
            </Link>
          </div>

          {/* User Info, Language Switcher & Logout */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            <div className="hidden sm:flex items-center space-x-3 text-sm text-green-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse neon-glow"></div>
              <span>{t('consciousness')}: <span className="text-cyan-300 font-medium terminal-text">{user?.email}</span></span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 neon-glow-secondary"
            >
              {t('disconnect')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 