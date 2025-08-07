import type { AppProps } from 'next/app';
import { Orbitron } from "next/font/google";
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>Antimemetics Division - Neural Interface</title>
        <meta name="description" content="Quantum neural interface for consciousness synchronization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${orbitron.variable} antialiased`}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
} 