import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { defaultLocale } from '../i18n';

export default function RootIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to default locale
    router.replace(`/${defaultLocale}`);
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen cyber-grid bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin neon-glow"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin animation-delay-2000 neon-glow-accent"></div>
      </div>
    </div>
  );
} 