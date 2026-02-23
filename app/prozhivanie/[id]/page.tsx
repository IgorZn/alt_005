// app/prozhivanie/[id]/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
    Ruler, Users, Dog, ArrowLeft, Calendar,
    Phone, Mail, Tag, Home, Maximize2,
} from 'lucide-react';
import { getHouseById } from '@/actions/house-actions';
import { amenityIconMap } from '@/lib/amenity-icons';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { useEffect, useState } from 'react';

// Импортируем типы из Prisma
import type { Photo } from '@/generated/prisma/client';
import type { HouseWithRelations, PhotoWithDimensions, AmenitiesByCategory } from '@/types/house';

export default function HouseDetailPage() {
    const params = useParams();
    const [house, setHouse] = useState<HouseWithRelations | null>(null);
    const [photosWithDimensions, setPhotosWithDimensions] = useState<PhotoWithDimensions[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadHouse() {
            const id = params.id as string;
            const houseId = parseInt(id);

            if (isNaN(houseId)) {
                notFound();
            }

            const houseData = await getHouseById(houseId);
            if (!houseData) {
                notFound();
            }

            setHouse(houseData as HouseWithRelations);

            // Загружаем размеры изображений
            const photosWithSizes = await Promise.all(
                houseData.photos.map(async (photo: Photo) => {
                    return new Promise<PhotoWithDimensions>((resolve) => {
                        const img = document.createElement('img');
                        img.onload = () => {
                            resolve({
                                id: photo.id,
                                url: photo.url,
                                width: img.width,
                                height: img.height,
                                isMain: photo.isMain,
                            });
                        };
                        img.onerror = () => {
                            // Если ошибка загрузки, ставим стандартные размеры
                            resolve({
                                id: photo.id,
                                url: photo.url,
                                width: 1920,
                                height: 1080,
                                isMain: photo.isMain,
                            });
                        };
                        img.src = photo.url;
                    });
                })
            );

            setPhotosWithDimensions(photosWithSizes);
            setLoading(false);
        }

        loadHouse();
    }, [params.id]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!house || !photosWithDimensions.length) {
        return notFound();
    }

    // Группировка удобств по категориям
    const amenitiesByCategory = house.amenities.reduce<AmenitiesByCategory>((acc, ha) => {
        const categoryName = ha.amenity.category.name;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(ha);
        return acc;
    }, {});

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

                {/* Галерея с PhotoSwipe и оригинальными размерами */}
                {photosWithDimensions.length > 0 && (
                    <HouseGallery photos={photosWithDimensions} title={house.title} />
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

// Компонент загрузки
function LoadingSkeleton() {
    return (
        <div className="w-full min-h-screen bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-6" />
                <div className="h-12 w-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-2" />
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-8" />

                {/* Галерея скелетон */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px] mb-8">
                    <div className="lg:col-span-3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                    <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Компонент галереи с PhotoSwipe и оригинальными размерами
function HouseGallery({ photos, title }: { photos: PhotoWithDimensions[]; title: string }) {
    const mainPhoto = photos.find(p => p.isMain) || photos[0];
    const otherPhotos = photos.filter(p => p.id !== mainPhoto?.id);

    return (
        <Gallery>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Главное фото (занимает 3 колонки на десктопе) */}
                <div className="lg:col-span-3 relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden group">
                    <Item
                        original={mainPhoto.url}
                        thumbnail={mainPhoto.url}
                        width={mainPhoto.width}
                        height={mainPhoto.height}
                        alt={title}
                    >
                        {({ ref, open }) => (
                            <div
                                ref={ref}
                                onClick={open}
                                className="relative w-full h-full cursor-pointer"
                            >
                                <Image
                                    src={mainPhoto.url}
                                    alt={title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    Увеличить
                                </div>
                            </div>
                        )}
                    </Item>
                </div>

                {/* Сетка миниатюр */}
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                    {otherPhotos.slice(0, 3).map((photo, index) => (
                        <Item
                            key={photo.id}
                            original={photo.url}
                            thumbnail={photo.url}
                            width={photo.width}
                            height={photo.height}
                            alt={`${title} - фото ${index + 2}`}
                        >
                            {({ ref, open }) => (
                                <div
                                    ref={ref}
                                    onClick={open}
                                    className="relative h-24 lg:h-32 rounded-lg overflow-hidden cursor-pointer group"
                                >
                                    <Image
                                        src={photo.url}
                                        alt={`${title} - фото ${index + 2}`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                            )}
                        </Item>
                    ))}

                    {/* Если есть еще фото, показываем счетчик */}
                    {otherPhotos.length > 3 && (
                        <Item
                            original={otherPhotos[3].url}
                            thumbnail={otherPhotos[3].url}
                            width={otherPhotos[3].width}
                            height={otherPhotos[3].height}
                            alt={`${title} - фото 4`}
                        >
                            {({ ref, open }) => (
                                <div
                                    ref={ref}
                                    onClick={open}
                                    className="relative h-24 lg:h-32 rounded-lg overflow-hidden cursor-pointer group"
                                >
                                    <Image
                                        src={otherPhotos[3].url}
                                        alt={`${title} - фото 4`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                                        <span className="text-white text-lg font-semibold">
                                            +{otherPhotos.length - 3}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </Item>
                    )}
                </div>
            </div>

            {/* Скрытые элементы для остальных фото (для полноценной галереи) */}
            {otherPhotos.slice(4).map((photo, index) => (
                <Item
                    key={photo.id}
                    original={photo.url}
                    thumbnail={photo.url}
                    width={photo.width}
                    height={photo.height}
                    alt={`${title} - фото ${index + 5}`}
                >
                    {({ ref }) => <div ref={ref} className="hidden" />}
                </Item>
            ))}
        </Gallery>
    );
}

// Компонент характеристик
function HouseSpecifications({ house }: { house: HouseWithRelations }) {
    const specs: Array<{ icon: React.ReactNode; label: string; value: string | number }> = [
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
function HouseAmenities({ amenitiesByCategory }: { amenitiesByCategory: AmenitiesByCategory }) {
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
function HouseBookingSidebar({ house }: { house: HouseWithRelations }) {
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