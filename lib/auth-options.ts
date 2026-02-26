// lib/auth-options.ts
import GoogleProvider from "next-auth/providers/google"
import YandexProvider from "next-auth/providers/yandex";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";

// Получаем список админов из .env
const ADMIN_EMAILS = process.env.ADMIN_USERS?.split(',').map(email => email.trim()) || [];

export const AUTH_OPTIONS: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID!,
            clientSecret: process.env.YANDEX_CLIENT_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // return true; // Пропускаем всех для теста
            console.log('=== SIGN IN ATTEMPT ===');
            console.log('User:', user);
            console.log('Account:', account);
            console.log('Profile:', profile);
            console.log('ADMIN_USERS:', process.env.ADMIN_USERS);

            const adminEmails = process.env.ADMIN_USERS?.split(',').map(e => e.trim()) || [];

            if (user.email && adminEmails.includes(user.email)) {
                console.log('✅ ACCESS GRANTED for:', user.email);
                return true;
            }

            console.log('❌ ACCESS DENIED for:', user.email);
            return false;
        },

        async redirect({ url, baseUrl }) {
            // После успешного входа направляем на /dashboard
            if (url.includes('/dashboard')) {
                return `${baseUrl}/dashboard`;
            }

            // Если попытка входа была с другой страницы, возвращаем туда
            if (url.startsWith(baseUrl)) {
                return url;
            }

            return baseUrl;
        },

        async session({ session, user }) {
            // Добавляем ID пользователя в сессию
            if (session.user) {
                // @ts-expect-error Много заморочек с типами, а так самый простой вариант
                session.user.id = user.id;

                // Добавляем флаг isAdmin для удобства
                // @ts-expect-error влом типы писать
                session.user.isAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;
            }
            return session;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;
            }
            return token;
        }
    },

    pages: {
        signIn: '/auth/sign-in', // Раскомментируем для кастомной страницы входа
        error: '/auth/error',    // Страница ошибки
    },

    session: {
        strategy: 'database',
    },

    debug: process.env.NODE_ENV === 'development',
}