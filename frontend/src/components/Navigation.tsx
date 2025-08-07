import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationProps {
  user?: {
    email: string;
  } | null;
  logout: () => void;
}

export function Navigation({ user, logout }: NavigationProps) {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <nav className="glass border-b border-green-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg flex items-center justify-center neon-glow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold gradient-text">
              ANTIMEMETICS DIVISION
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/')
                ? 'bg-green-600 text-white neon-glow'
                : 'text-green-300 hover:text-green-200 hover:bg-green-900/50'
                }`}
            >
              NEURAL HUB
            </Link>
            <Link
              href="/todos"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/todos')
                ? 'bg-cyan-600 text-white neon-glow-accent'
                : 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-900/50'
                }`}
            >
              TASK MATRIX
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 text-sm text-green-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse neon-glow"></div>
              <span>CONSCIOUSNESS: <span className="text-cyan-300 font-medium terminal-text">{user?.email}</span></span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 neon-glow-secondary"
            >
              DISCONNECT
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 