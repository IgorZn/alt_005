// app/auth/sign-in/page.tsx
'use client';

import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Компонент, который использует useSearchParams
function SignInContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const error = searchParams.get('error');
    const [loading, setLoading] = useState<string | null>(null);

    const handleSignIn = async (provider: string) => {
        setLoading(provider);
        await signIn(provider, {
            callbackUrl,
            redirect: true
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center">Вход в панель управления</h2>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                        {error === 'AccessDenied' ? 'Доступ запрещен' : 'Ошибка входа'}
                    </div>
                )}

                <button
                    onClick={() => handleSignIn('yandex')}
                    disabled={!!loading}
                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg disabled:opacity-50"
                >
                    {loading === 'yandex' ? 'Вход...' : 'Войти через Яндекс'}
                </button>

                <button
                    onClick={() => handleSignIn('google')}
                    disabled={!!loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                    {loading === 'google' ? 'Вход...' : 'Войти через Google'}
                </button>
            </div>
        </div>
    );
}

// Основной компонент с Suspense
export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500" />
            </div>
        }>
            <SignInContent />
        </Suspense>
    );
}