// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { Hotel, Calendar, Image as ImageIcon, Users } from 'lucide-react';

export default async function DashboardPage() {
    const [housesCount, bookingsCount, photosCount, amenitiesCount] = await Promise.all([
        prisma.house.count(),
        prisma.booking.count(),
        prisma.photo.count(),
        prisma.amenity.count(),
    ]);

    const stats = [
        { title: 'Домов', value: housesCount, icon: Hotel, color: 'bg-blue-500' },
        { title: 'Бронирований', value: bookingsCount, icon: Calendar, color: 'bg-green-500' },
        { title: 'Фотографий', value: photosCount, icon: ImageIcon, color: 'bg-purple-500' },
        { title: 'Удобств', value: amenitiesCount, icon: Users, color: 'bg-amber-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Панель управления
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.color}`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}