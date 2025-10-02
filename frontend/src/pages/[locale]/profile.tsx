import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Navigation } from '../../components/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations } from '../../hooks/useTranslations';
import { AvatarUpload } from '../../components/molecules/AvatarUpload';

export default function ProfilePage() {
    const { user, token, login } = useAuth();
    const t = useTranslations('profile');

    return (
        <ProtectedRoute>
            <div className="min-h-screen cyber-grid bg-gradient-to-br from-black via-gray-900 to-black relative">
                <div className="scan-line"></div>

                <Navigation />

                <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="glass rounded-xl border border-green-500/30 p-6 shadow-xl">
                        <h1 className="text-2xl font-bold gradient-text mb-6">{t('title')}</h1>

                        <div className="grid grid-cols-1 gap-6">
                            <section>
                                <h2 className="text-sm font-semibold text-green-300 mb-3 tracking-widest">Avatar</h2>
                                <AvatarUpload
                                    currentAvatarUrl={user?.avatarUrl}
                                    onAvatarUpdate={(newAvatarUrl) => {
                                        if (user) {
                                            const newUser = { ...user, avatarUrl: newAvatarUrl };
                                            login(token || '', newUser);
                                        }
                                    }}
                                    userName={user?.name}
                                    userEmail={user?.email}
                                />
                            </section>
                            <section>
                                <h2 className="text-sm font-semibold text-green-300 mb-3 tracking-widest">{t('basicInfo')}</h2>
                                <div className="bg-black/40 rounded-lg p-4 border border-green-500/20">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-300">{t('name')}</span>
                                        <span className="text-cyan-300 font-medium terminal-text">{user?.name || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-300">{t('email')}</span>
                                        <span className="text-cyan-300 font-medium terminal-text">{user?.email || '—'}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Language switcher and logout removed as requested */}
                        </div>
                    </div>
                </main>

                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>


            </div>
        </ProtectedRoute>
    );
}
