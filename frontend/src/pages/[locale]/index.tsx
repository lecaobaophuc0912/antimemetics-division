import Image from "next/image";
import Head from 'next/head';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { Navigation } from '../../components/Navigation';
import Link from "next/link";
import { useHomeTranslations, useMetaTranslations, useCommonTranslations } from '../../hooks/useTranslations';

export default function Home() {
  const { user, logout } = useAuth();
  const { locale } = useI18n();
  const t = useHomeTranslations();
  const tm = useMetaTranslations();
  const tc = useCommonTranslations();

  const handleLogout = async () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>{tm('homeTitle')}</title>
        <meta name="description" content={tm('homeDescription')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen cyber-grid bg-gradient-to-br from-black via-gray-900 to-black relative">
        {/* Scanning line effect */}
        <div className="scan-line"></div>

        {/* Navigation */}
        <Navigation user={user} logout={handleLogout} />

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 neon-glow">
                <span className="gradient-text glitch">
                  {t('title')}
                </span>
              </h2>
              <p className="text-xl text-cyan-300 max-w-3xl mx-auto leading-relaxed terminal-text">
                {t('subtitle')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href={`/${locale}/todos`}
                className="group px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl hover:from-green-700 hover:to-cyan-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 flex items-center space-x-3 neon-glow"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{t('accessNeuralTasks')}</span>
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-pink-500 text-pink-300 rounded-xl hover:border-pink-400 hover:text-pink-200 transition-all duration-300 font-semibold text-lg hover:bg-pink-900/50 transform hover:-translate-y-1 neon-glow-secondary"
              >
                {t('viewSourceMatrix')}
              </Link>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Authentication Status */}
            <div className="glass border border-green-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center neon-glow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400 neon-glow">{t('neuralAuthentication')}</h3>
                  <p className="text-green-300">{t('statusActive')}</p>
                </div>
              </div>
              <p className="text-green-200 text-lg font-medium">{t('neuralLinkEstablished')}</p>
            </div>

            {/* User Info */}
            <div className="glass-accent border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center neon-glow-accent">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 neon-glow-accent">{t('consciousnessId')}</h3>
                  <p className="text-cyan-300">{t('activeSession')}</p>
                </div>
              </div>
              <p className="text-cyan-200 text-lg font-medium break-all terminal-text">{user?.email}</p>
            </div>
          </div>

          {/* Theme Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4 neon-glow">{t('neuralInterfaces')}</h3>
              <p className="text-gray-400 text-lg">{t('selectProtocol')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Theme options with cyberpunk names */}
              <Link href={`/${locale}/memetics`} className="glass border border-green-500/30 rounded-xl p-4 text-center hover:border-green-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"></div>
                <h4 className="text-green-400 font-semibold text-sm">{t('neural')}</h4>
                <p className="text-green-300 text-xs">{t('primaryProtocol')}</p>
              </Link>

              <Link href={`/${locale}/quantum`} className="glass-secondary border border-pink-500/30 rounded-xl p-4 text-center hover:border-pink-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"></div>
                <h4 className="text-pink-400 font-semibold text-sm">{t('quantum')}</h4>
                <p className="text-pink-300 text-xs">{t('advancedProtocol')}</p>
              </Link>

              <Link href={`/${locale}/cyber`} className="glass-accent border border-cyan-500/30 rounded-xl p-4 text-center hover:border-cyan-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"></div>
                <h4 className="text-cyan-400 font-semibold text-sm">{t('cyber')}</h4>
                <p className="text-cyan-300 text-xs">{t('enhancedProtocol')}</p>
              </Link>

              <Link href={`/${locale}/matrix`} className="glass border border-yellow-500/30 rounded-xl p-4 text-center hover:border-yellow-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"></div>
                <h4 className="text-yellow-400 font-semibold text-sm">{t('matrix')}</h4>
                <p className="text-yellow-300 text-xs">{t('legacyProtocol')}</p>
              </Link>

              <Link href={`/${locale}/void`} className="glass border border-gray-500/30 rounded-xl p-4 text-center hover:border-gray-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"></div>
                <h4 className="text-gray-400 font-semibold text-sm">{t('void')}</h4>
                <p className="text-gray-300 text-xs">{t('minimalProtocol')}</p>
              </Link>

              <Link href={`/${locale}/plasma`} className="glass-secondary border border-purple-500/30 rounded-xl p-4 text-center hover:border-purple-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"></div>
                <h4 className="text-purple-400 font-semibold text-sm">{t('plasma')}</h4>
                <p className="text-purple-300 text-xs">{t('experimentalProtocol')}</p>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="glass border border-blue-500/30 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-blue-400 neon-glow-accent mb-2">{t('systemStatus')}</h3>
              <p className="text-blue-300">{t('quantumNetworkOperational')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center neon-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-green-400 font-semibold">{t('neuralLink')}</h4>
                <p className="text-green-300 text-sm">{t('online')}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500 rounded-full mx-auto mb-3 flex items-center justify-center neon-glow-accent overflow-hidden">
                  <Image
                    src="/antimemetics-division-logo.png"
                    alt={tc('antimemeticsLogo')}
                    width={32}
                    height={32}
                    className="object-contain filter brightness-110 contrast-125"
                  />
                </div>
                <h4 className="text-cyan-400 font-semibold">{t('quantumCore')}</h4>
                <p className="text-cyan-300 text-sm">{t('active')}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center neon-glow-secondary">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-pink-400 font-semibold">{t('dataFlow')}</h4>
                <p className="text-pink-300 text-sm">{t('optimal')}</p>
              </div>
            </div>
          </div>
        </main>

        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 