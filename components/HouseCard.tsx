// components/HouseCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Ruler, Users, BedDouble, ChevronLeft, ChevronRight } from 'lucide-react';
import { HouseCardData } from '@/types/house';
import { useState } from 'react';

interface HouseCardProps {
    house: HouseCardData;
}

export default function HouseCard({ house }: HouseCardProps) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const photos = house.photos.length > 0 ? house.photos : [{ url: '/placeholder-house.jpg', isMain: true }];

    const nextPhoto = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Левая колонка с мини-слайдером */}
                <div className="relative h-64 md:h-full min-h-[300px] group">
                    {/* Текущее фото */}
                    <div className="relative w-full h-full">
                        <Image
                            src={photos[currentPhotoIndex].url}
                            alt={house.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Индикатор количества фото */}
                        {photos.length > 1 && (
                            <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
                                {currentPhotoIndex + 1} / {photos.length}
                            </div>
                        )}
                    </div>

                    {/* Навигационные стрелки */}
                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={prevPhoto}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextPhoto}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Индикаторы (точки) */}
                    {photos.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {photos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentPhotoIndex(index);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentPhotoIndex
                                            ? 'bg-white w-4'
                                            : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                />
                            ))}
                        </div>
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

                        {/* Тип кроватей */}
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