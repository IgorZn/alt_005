// app/dashboard/houses/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { deleteHouse } from '@/actions/house-actions';
import { getAdminHouses } from '@/actions/admin-actions';
import { DeleteHouseButton } from '@/components/dashboard/DeleteHouseButton';

export default async function HousesPage() {
    const houses = await getAdminHouses();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Управление домами
                </h1>
                <Link href="/dashboard/houses/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить дом
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {houses.map((house) => (
                    <Card key={house.id}>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                                {/* Фото */}
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    {house.photos[0] ? (
                                        <Image
                                            src={house.photos[0].url}
                                            alt={house.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">Нет фото</span>
                                        </div>
                                    )}
                                </div>

                                {/* Информация */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {house.title}
                                    </h3>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span>{house.area} м²</span>
                                        <span>•</span>
                                        <span>{house.capacity} чел.</span>
                                        <span>•</span>
                                        <span>{house.rooms} комн.</span>
                                        {house.price && (
                                            <>
                                                <span>•</span>
                                                <span className="font-semibold text-amber-600">
                                                    {house.price} ₽/сутки
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                        <span>Бронирований: {house._count.bookings}</span>
                                        <span>•</span>
                                        <span className={house.isAvailable ? 'text-green-500' : 'text-red-500'}>
                                            {house.isAvailable ? 'Доступен' : 'Недоступен'}
                                        </span>
                                    </div>
                                </div>

                                {/* Действия */}
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/houses/${house.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <DeleteHouseButton houseId={house.id} houseTitle={house.title} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {houses.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                Нет домов. Создайте первый дом!
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}