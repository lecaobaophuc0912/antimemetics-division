import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { authService } from '../../services';
import Link from 'next/link';
import { useAuthTranslations, useMetaTranslations, useCommonTranslations } from '../../hooks/useTranslations';

export default function Register() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { locale } = useI18n();
  const t = useAuthTranslations();
  const tm = useMetaTranslations();
  const tc = useCommonTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect to home if already authenticated
    if (!isLoading && isAuthenticated) {
      router.push(`/${locale}`);
    }
  }, [isAuthenticated, isLoading, router, locale]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('consciousnessIdRequired');
    } else if (formData.name.length < 3) {
      newErrors.name = t('consciousnessIdMinLength');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('neuralIdRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidNeuralIdFormat');
    }

    if (!formData.password) {
      newErrors.password = t('accessCodeRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('accessCodeMinLength');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('accessCodesDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await authService.register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      // Auto-login after successful registration
      login(data.token, data.user);

      // Redirect to home page with success message
      router.push(`/${locale}`);
    } catch (error: any) {
      const errorMessage = error?.message || t('neuralLinkInitializationFailed');
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen cyber-grid bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin neon-glow"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin animation-delay-2000 neon-glow-accent"></div>
        </div>
      </div>
    );
  }

  // Don't render register form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{tm('registerTitle')}</title>
        <meta name="description" content={tm('registerDescription')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen cyber-grid bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Scanning line effect */}
        <div className="scan-line"></div>

        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl neon-glow-accent overflow-hidden">
              <Image
                src="/antimemetics-division-logo.png"
                alt={tc('antimemeticsLogo')}
                width={64}
                height={64}
                className="object-contain filter brightness-110 contrast-125"
              />
            </div>
            <h2 className="text-4xl font-bold text-cyan-400 mb-2 neon-glow-accent">
              {t('initializeNeuralLinkTitle')}
            </h2>
            <p className="text-pink-300 text-lg terminal-text">
              {t('createConsciousnessProfile')}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              {t('alreadySynchronized')}{' '}
              <Link
                href={`/${locale}/login`}
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                {t('accessNeuralInterface')}
              </Link>
            </p>
          </div>

          {/* Registration Form */}
          <div className="glass-accent border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-cyan-300 mb-2">
                  {t('consciousnessIdentifier')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.name ? 'border-red-500' : 'border-cyan-600'
                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 terminal-text`}
                  placeholder={t('enterConsciousnessId')}
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2">
                  {t('neuralId')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.email ? 'border-red-500' : 'border-cyan-600'
                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 terminal-text`}
                  placeholder={t('enterNeuralId')}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cyan-300 mb-2">
                  {t('accessCode')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.password ? 'border-red-500' : 'border-cyan-600'
                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 terminal-text`}
                  placeholder={t('enterAccessCode')}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-cyan-300 mb-2">
                  {t('confirmAccessCode')}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-cyan-600'
                    } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 terminal-text`}
                  placeholder={t('confirmAccessCodePlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-gradient-to-r from-red-900/50 to-red-800/30 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-red-200">{errors.submit}</div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 neon-glow-accent"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('initializing')}</span>
                  </div>
                ) : (
                  t('establishConsciousnessLink')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 