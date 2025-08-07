import type { AppProps } from 'next/app';
import { Orbitron } from "next/font/google";
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';
import { I18nProvider } from '../contexts/I18nContext';
import { LocaleDebugger } from '../components/LocaleDebugger';
import './globals.css';

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

function AppContent({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className={`${orbitron.variable} antialiased`}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <I18nProvider>
      <AppContent {...props} />
    </I18nProvider>
  );
} 