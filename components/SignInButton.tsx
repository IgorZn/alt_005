// components/SignInButton.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';

export default function SignInButton() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    if (status === 'loading') {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        );
    }

    if (session?.user) {
        // @ts-expect-error - isAdmin добавлен в сессию
        const isAdmin = session.user.isAdmin;

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {session.user.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                    )}
                    <span className="hidden lg:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                        {session.user.name || session.user.email}
                    </span>
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <>
                        {/* Overlay для закрытия по клику вне меню */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 z-50">
                            {/* User info */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {session.user.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {session.user.email}
                                </p>
                            </div>

                            {/* Menu items */}
                            <div className="p-2">
                                {isAdmin && (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LayoutDashboard className="w-5 h-5" />
                                            <span>Панель управления</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/houses"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Settings className="w-5 h-5" />
                                            <span>Управление домами</span>
                                        </Link>
                                        <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
                                    </>
                                )}

                                <button
                                    onClick={() => {
                                        signOut({ callbackUrl: '/' });
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Выйти</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Не авторизован - ведём на страницу входа с выбором провайдера
    return (
        <button
            onClick={() => router.push('/auth/sign-in')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm font-semibold"
        >
            <LogIn className="w-4 h-4" />
            <span className="hidden lg:inline">Войти</span>
        </button>
    );
}