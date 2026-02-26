// proxy.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { NextFetchEvent } from 'next/server';

export function __proxy(request: NextRequest, event: NextFetchEvent) {
    return withAuth(
        function middleware(req) {
            // Просто проверяем, что пользователь авторизован
            // Проверку isAdmin делаем в layout или на страницах
            return NextResponse.next();
        },
        {
            callbacks: {
                authorized: ({ token }) => !!token, // Только проверка наличия токена
            },
            pages: {
                signIn: '/auth/sign-in',
                error: '/auth/error',
            },
        }
    )(request, event);
}

export const config = {
    matcher: ['/dashboard/:path*']
};