// app/dashboard/layout.tsx
import DashboardSidebar from '@/components/dashboard/Sidebar';
import { Toaster } from 'sonner';

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black">
            <DashboardSidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
            <Toaster richColors position="top-right" />
        </div>
    );
}