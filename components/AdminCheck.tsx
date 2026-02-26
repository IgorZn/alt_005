// components/AdminCheck.tsx
'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

interface AdminCheckProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export default function AdminCheck({ children, fallback = null }: AdminCheckProps) {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Загрузка...</div>;
    }

    // @ts-expect-error Так проще
    if (session?.user?.isAdmin) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}