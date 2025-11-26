import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Navigation } from '../../components/Navigation';
import { ChatBasicInfo, MessengerBubble } from '@/components/organisms/MessengerBubble';
import { MessengerChat } from '@/components/organisms/MessengerChat';
import { useState } from 'react';
import Head from "next/head";
import { useMetaTranslations } from '@/hooks/useTranslations';


export default function MessengerPage() {

    const tm = useMetaTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [chatInfo, setChatInfo] = useState<ChatBasicInfo>();

    const onCloseChat = () => {
        setIsOpen(false);
    }

    const onBubbleClick = (info: ChatBasicInfo) => {
        if (!info) return;
        setChatInfo(info);
        setIsOpen(true);
    }

    return (
        <ProtectedRoute>
            <Head>
                <title>{tm('messengerTitle')}</title>
                <meta name="description" content={tm('messengerDescription')} />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Background effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
                </div>

                <Navigation />

                <MessengerBubble onBubbleClick={onBubbleClick} />

                {chatInfo && <MessengerChat isOpen={isOpen} basicInfo={chatInfo} onClose={onCloseChat} />}
            </div>
        </ProtectedRoute>
    );
}

function useMetaTra() {
    throw new Error('Function not implemented.');
}

