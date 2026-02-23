// components/HouseCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Ruler, Users, BedDouble } from 'lucide-react';
import { HouseCardData } from '@/types/house';

interface HouseCardProps {
    house: HouseCardData;
}

export default function HouseCard({ house }: HouseCardProps) {
    const mainPhoto = house.photos.find(p => p.isMain) || house.photos[0];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Левая колонка с фото */}
                <div className="relative h-64 md:h-full min-h-[250px]">
                    {mainPhoto && (
                        <Image
                            src={mainPhoto.url}
                            alt={house.title}
                            fill
                            className="object-cover"
                        />
                    )}
                </div>

                {/* Правая колонка с информацией */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {house.title}
                    </h2>

                    <div className="space-y-3 mb-6">
                        {/* Метраж */}
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <Ruler className="w-5 h-5 text-amber-500" />
                            <span>Площадь: <span className="font-semibold text-gray-900 dark:text-white">{house.area} м²</span></span>
                        </div>

                        {/* Количество мест */}
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <Users className="w-5 h-5 text-amber-500" />
                            <span>Вместимость: <span className="font-semibold text-gray-900 dark:text-white">{house.capacity} чел.</span></span>
                        </div>

                        {/* Тип кроватей (можно сделать более точным из amenities) */}
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <BedDouble className="w-5 h-5 text-amber-500" />
                            <span>2 односпальные или 1 двуспальная</span>
                        </div>
                    </div>

                    {/* Цена */}
                    {house.price && (
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                {house.price} ₽
                            </span>
                            <span className="text-gray-500 dark:text-gray-500 text-sm ml-2">/ сутки</span>
                        </div>
                    )}

                    {/* Кнопка */}
                    <Link
                        href={`/prozhivanie/${house.id}`}
                        className="inline-block w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors text-center"
                    >
                        Подробнее
                    </Link>
                </div>
            </div>
        </div>
    );
}