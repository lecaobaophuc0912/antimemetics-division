import Image from "next/image";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from '../components/Navigation';
import apiService from "@/services/api";

export default function Home() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <Navigation user={user} logout={handleLogout} />

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome Back!!!
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Experience the power of modern web development with our Next.js frontend and NestJS backend integration,
                featuring JWT authentication and dynamic theming.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="/todos"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Manage Todos</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl hover:border-gray-500 hover:text-white transition-all duration-300 font-semibold text-lg hover:bg-gray-800/50 transform hover:-translate-y-1"
              >
                View Source Code
              </a>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Authentication Status */}
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400">Authentication</h3>
                  <p className="text-green-300">Status: Active</p>
                </div>
              </div>
              <p className="text-green-200 text-lg font-medium">Authentication successful! Your session is secure.</p>
            </div>

            {/* User Info */}
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400">User Profile</h3>
                  <p className="text-blue-300">Active Session</p>
                </div>
              </div>
              <p className="text-blue-200 text-lg font-medium break-all">{user?.email}</p>
            </div>
          </div>

          {/* Theme Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Explore Themes</h3>
              <p className="text-gray-400 text-lg">Customize your experience with our beautiful theme options</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Blue', href: '/blue', bg: 'from-blue-500 to-blue-600', hover: 'hover:from-blue-600 hover:to-blue-700' },
                { name: 'Green', href: '/green', bg: 'from-green-500 to-green-600', hover: 'hover:from-green-600 hover:to-green-700' },
                { name: 'Red', href: '/red', bg: 'from-red-500 to-red-600', hover: 'hover:from-red-600 hover:to-red-700' },
                { name: 'Purple', href: '/purple', bg: 'from-purple-500 to-purple-600', hover: 'hover:from-purple-600 hover:to-purple-700' },
                { name: 'Orange', href: '/orange', bg: 'from-orange-500 to-orange-600', hover: 'hover:from-orange-600 hover:to-orange-700' },
                { name: 'Pink', href: '/pink', bg: 'from-pink-500 to-pink-600', hover: 'hover:from-pink-600 hover:to-pink-700' }
              ].map((theme) => (
                <a
                  key={theme.name}
                  href={theme.href}
                  className={`bg-gradient-to-r ${theme.bg} ${theme.hover} text-white rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl font-semibold`}
                >
                  {theme.name}
                </a>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Key Features</h3>
              <p className="text-gray-400 text-lg">Discover what makes this application special</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '🔐',
                  title: 'JWT Authentication',
                  description: 'Secure login/registration system with JWT tokens',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: '🎨',
                  title: 'Dynamic Themes',
                  description: 'Switch themes with different color schemes',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: '🛡️',
                  title: 'Security',
                  description: 'Route protection and automatic redirection',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  icon: '⚡',
                  title: 'Performance',
                  description: 'Optimized with Next.js and NestJS',
                  color: 'from-orange-500 to-orange-600'
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                <span className="text-gray-400 font-medium">NextJS + NestJS Demo</span>
              </div>

              <div className="flex space-x-6">
                <a
                  href="https://nextjs.org/learn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Learn Next.js</span>
                </a>
                <a
                  href="https://nestjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>NestJS Docs</span>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub →</span>
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Background Decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 