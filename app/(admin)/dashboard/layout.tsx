// app/dashboard/layout.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AUTH_OPTIONS } from '@/lib/auth-options';
import DashboardSidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(AUTH_OPTIONS);

    if (!session) {
        redirect('/auth/sign-in?callbackUrl=/dashboard');
    }

    // @ts-expect-error так проще
    if (!session.user?.isAdmin) {
        redirect('/auth/error?error=AccessDenied');
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black">
            <DashboardSidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}