// components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Hotel, Calendar, Settings, Users, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { href: '/dashboard', label: 'Главная', icon: Home },
    { href: '/dashboard/houses', label: 'Дома', icon: Hotel },
    { href: '/dashboard/bookings', label: 'Бронирования', icon: Calendar },
    { href: '/dashboard/amenities', label: 'Удобства', icon: Users },
    { href: '/dashboard/gallery', label: 'Галерея', icon: Image },
    { href: '/dashboard/settings', label: 'Настройки', icon: Settings },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Админ-панель
                </h2>
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}