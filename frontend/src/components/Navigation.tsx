import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '../contexts/I18nContext';
import { useNavigationTranslations, useCommonTranslations } from '../hooks/useTranslations';
import { Avatar } from './atoms/Avatar';
import { useAvatar } from '../hooks/useAvatar';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
  const router = useRouter();
  const { locale } = useI18n();
  const { user, logout } = useAuth();
  const t = useNavigationTranslations();
  const tc = useCommonTranslations();

  // Ensure locale is valid before rendering
  if (!locale || !['en', 'vi'].includes(locale)) {
    return null; // Don't render until locale is properly set
  }

  const isActive = (path: string) => {
    return router.pathname === `/${locale}${path}` || router.pathname === path;
  };

  const avatarSource = useAvatar({ avatarUrl: user?.avatarUrl });

  return (
    <nav className="glass border-b border-green-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href={`/${locale}`} className="w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg flex items-center justify-center neon-glow">
              <Image
                src="/antimemetics-division-logo.png"
                alt={tc('antimemeticsLogo')}
                width={24}
                height={24}
                className="object-contain filter brightness-110 contrast-125"
              />
            </Link>
            <Link href={`/${locale}`} className="text-lg font-bold gradient-text">
              {tc('antimemeticsDivision')}
            </Link>
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
            <Link
              href={`/${locale}/messenger`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/messenger')
                ? 'bg-purple-600 text-white neon-glow-accent'
                : 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/50'
                }`}
            >
              {t('messenger')}
            </Link>
          </div>

          {/* Language switcher, user name linking to profile, and disconnect */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/profile`}
              className="flex items-center"
              title={t('profile')}
            >
              <Avatar
                src={avatarSource.displaySrc}
                alt="avatar"
                size="sm"
                className="border border-green-500/40"
                defaultText={user?.name || user?.email || '?'}
              />
            </Link>
            <Link
              href={`/${locale}/profile`}
              className="hidden sm:inline-block px-3 py-1 rounded-lg text-sm font-medium text-green-300 hover:text-white hover:bg-green-900/50 transition-all duration-200"
              title={t('profile')}
            >
              {user?.name || user?.email}
            </Link>
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