// components/NavBar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import SignInButton from "@/components/SignInButton";

const navigationItems = [
    { href: '/prozhivanie', label: 'Проживание' },
    { href: '/uslugi', label: 'Услуги' },
    { href: '/chem-zanyatsya', label: 'Чем заняться?' },
    { href: '/restoran', label: 'Ресторан' },
    { href: '/istoriya', label: 'История' },
    { href: '/contacts', label: 'Контакты' },
];

export default function NavBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="block">
                            <div className="relative h-14 w-36">
                                <Image
                                    src="/logo.png" // Замените на путь к вашему логотипу
                                    alt="Altai Paradise"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Language switcher */}
                        <div className="flex items-center space-x-2">
                            {/*<Link href="/ru" className="text-gray-400 hover:text-gray-600 text-lg">*/}
                            {/*    RU*/}
                            {/*</Link>*/}
                            {/*<span className="text-gray-300">|</span>*/}
                            {/*<Link href="/en" className="text-gray-400 hover:text-gray-600 text-lg">*/}
                            {/*    EN*/}
                            {/*</Link>*/}
                        </div>

                        {/* Booking button */}
                        <Link
                            href="/booking"
                            className="bg-[#1E3A5F] text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-[#15304d] transition-colors"
                        >
                            ЗАБРОНИРОВАТЬ
                        </Link>

                        {/* Sign in button */}
                        <SignInButton />
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-200">
                    <div className="px-4 pt-4 pb-6 space-y-3">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block py-2.5 text-gray-700 hover:text-gray-900 text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Mobile language switcher */}
                        <div className="flex items-center space-x-3 pt-2">
                            {/*<Link*/}
                            {/*    href="/en"*/}
                            {/*    className="text-gray-500 hover:text-gray-700 text-lg font-medium"*/}
                            {/*    onClick={() => setIsMobileMenuOpen(false)}*/}
                            {/*>*/}
                            {/*    English*/}
                            {/*</Link>*/}
                            {/*<span className="text-gray-300">|</span>*/}
                            {/*<Link*/}
                            {/*    href="/fi"*/}
                            {/*    className="text-gray-500 hover:text-gray-700 text-lg font-medium"*/}
                            {/*    onClick={() => setIsMobileMenuOpen(false)}*/}
                            {/*>*/}
                            {/*    Suomi*/}
                            {/*</Link>*/}
                        </div>

                        {/* Mobile booking button */}
                        <div className="pt-4">
                            <Link
                                href="/booking"
                                className="block w-full bg-[#1E3A5F] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-[#15304d] transition-colors text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                ЗАБРОНИРОВАТЬ
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}