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
    <nav className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              NextJS + NestJS
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/todos"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/todos')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Todos
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Logged in as: <span className="text-blue-300 font-medium">{user?.email}</span></span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 