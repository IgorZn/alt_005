// app/prozhivanie/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Ruler, Users, BedDouble, Dog, ArrowLeft, Calendar,
    Phone, Mail, Tag, Home, Maximize2,
} from 'lucide-react';
import { getHouseById } from '@/actions/house-actions';
import { amenityIconMap } from '@/lib/amenity-icons';

interface HouseDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function HouseDetailPage({ params }: HouseDetailPageProps) {
    const { id } = await params;
    const houseId = parseInt(id);

    if (isNaN(houseId)) {
        notFound();
    }

    const house = await getHouseById(houseId);

    if (!house) {
        notFound();
    }

    // Группировка удобств по категориям
    const amenitiesByCategory = house.amenities.reduce((acc, ha) => {
        const categoryName = ha.amenity.category.name;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(ha);
        return acc;
    }, {} as Record<string, typeof house.amenities>);

    return (
        <div className="w-full min-h-screen bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Навигация назад */}
                <Link
                    href="/prozhivanie"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Назад к списку домов
                </Link>

                {/* Заголовок */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {house.title}
                </h1>
                {house.subtitle && (
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        {house.subtitle}
                    </p>
                )}

                {/* Галерея */}
                {house.photos.length > 0 && (
                    <HouseGallery photos={house.photos} title={house.title} />
                )}

                {/* Основная информация */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Левая колонка - характеристики и удобства */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Характеристики */}
                        <HouseSpecifications house={house} />

                        {/* Описание */}
                        {house.description && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Описание
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                    {house.description}
                                </p>
                            </div>
                        )}

                        {/* Удобства по категориям */}
                        <HouseAmenities amenitiesByCategory={amenitiesByCategory} />
                    </div>

                    {/* Правая колонка - бронирование */}
                    <HouseBookingSidebar house={house} />
                </div>
            </div>
        </div>
    );
}

// Компонент галереи
function HouseGallery({ photos, title }: { photos: any[]; title: string }) {
    const mainPhoto = photos.find(p => p.isMain) || photos[0];
    const otherPhotos = photos.filter(p => p.id !== mainPhoto?.id);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                <Image
                    src={mainPhoto.url}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                {otherPhotos.slice(0, 3).map((photo) => (
                    <div key={photo.id} className="relative h-24 lg:h-32 rounded-lg overflow-hidden">
                        <Image
                            src={photo.url}
                            alt={`${title} - фото`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Компонент характеристик
function HouseSpecifications({ house }: { house: any }) {
    const specs = [
        { icon: <Home className="w-5 h-5" />, label: 'Комнат', value: house.rooms },
        { icon: <Ruler className="w-5 h-5" />, label: 'Площадь', value: `${house.area} м²` },
        { icon: <Users className="w-5 h-5" />, label: 'Вместимость', value: `${house.capacity} чел.` },
        { icon: <Maximize2 className="w-5 h-5" />, label: 'Этажей', value: '1' },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {specs.map((spec, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="text-amber-500 mb-2">{spec.icon}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{spec.label}</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{spec.value}</div>
                </div>
            ))}
        </div>
    );
}

// Компонент удобств по категориям
function HouseAmenities({ amenitiesByCategory }: { amenitiesByCategory: Record<string, any[]> }) {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Удобства
            </h2>
            <div className="space-y-6">
                {Object.entries(amenitiesByCategory).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                            {category}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                                >
                                    <span className="text-amber-600 dark:text-amber-400">
                                        {amenityIconMap[item.amenity.name] || <Tag className="w-5 h-5" />}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {item.amenity.name}
                                    </span>
                                    {item.extraInfo && (
                                        <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">
                                            {item.extraInfo}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Компонент сайдбара с бронированием
function HouseBookingSidebar({ house }: { house: any }) {
    return (
        <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Забронировать
                </h2>

                {house.price && (
                    <div className="mb-6">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                            {house.price} ₽
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-500">
                            за сутки
                        </div>
                    </div>
                )}

                {house.petFee && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Dog className="w-4 h-4 text-amber-500" />
                            <span>Доплата за питомцев: {house.petFee} ₽/сутки</span>
                        </div>
                        {house.maxPets && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 ml-6">
                                Максимум {house.maxPets} {house.maxPets === 1 ? 'питомец' : 'питомца'}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <Link
                        href={`/booking?house=${house.id}`}
                        className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                    >
                        <Calendar className="w-5 h-5" />
                        Выбрать даты
                    </Link>

                    <a
                        href="tel:+79139965777"
                        className="flex items-center justify-center gap-2 w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        Позвонить
                    </a>

                    <a
                        href="mailto:info@altaiparadise.ru"
                        className="flex items-center justify-center gap-2 w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        Написать
                    </a>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
                    Бесплатная отмена за 7 дней до заезда
                </p>
            </div>
        </div>
    );
}