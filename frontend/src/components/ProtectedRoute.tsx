import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { locale } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, isLoading, router, locale]);

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

  // Don't render children if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 