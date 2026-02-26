// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const getErrorMessage = (error: string) => {
        switch (error) {
            case 'AccessDenied':
                return 'Доступ запрещен. Ваш email не в списке администраторов.';
            case 'OAuthSignin':
                return 'Ошибка при входе через провайдера.';
            case 'OAuthCallback':
                return 'Ошибка при обработке входа.';
            default:
                return 'Произошла ошибка при входе. Попробуйте позже.';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg text-center">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ошибка входа
                </h2>

                <p className="text-gray-600 dark:text-gray-400">
                    {error ? getErrorMessage(error) : 'Неизвестная ошибка'}
                </p>

                <Link
                    href="/auth/signin"
                    className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                    Вернуться ко входу
                </Link>
            </div>
        </div>
    );
}