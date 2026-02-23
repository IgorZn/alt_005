//lib/auth-options.ts
import GoogleProvider from "next-auth/providers/google"
import YandexProvider from "next-auth/providers/yandex";
import {PrismaAdapter} from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import {prisma} from "@/lib/prisma";

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
            return true;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
        async session({ session, user }) {
            // Добавляем ID пользователя в сессию
            if (session.user) {
                // @ts-expect-error Много заморочек с типами, а так самый простой вариант
                session.user.id = user.id;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    },

    pages: {
        // signIn: '/auth/signin',
        // error: '/auth/error',
    },

    session: {
        strategy: 'database', // или 'jwt' - database стратегия использует БД для сессий
    },

    debug: process.env.NODE_ENV === 'development',
}