// components/PhotoGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';

interface PhotoWithDimensions {
    file: string;
    width: number;
    height: number;
}

// Все доступные фото
const photoFiles = [
    'alt_view_019.jpg',
    // 'alt_view_003.jpg',
    // 'alt_view_004.jpg',
    // 'alt_view_005.jpg',
    'alt_view_006.jpg',
    'alt_view_008.jpg',
    'alt_view_009.jpg',
    'alt_view_010.jpg',
    'alt_view_011.jpg',
    'alt_view_012.jpg',
    'alt_view_018.jpg',
    // 'alt_view_013.jpg',
    'alt_view_014.jpg',
    'alt_view_015.jpg',
    // 'alt_view_016.jpg',
    // 'alt_view_017.jpg',
    // 'alt_view_002.jpg',
];

// Паттерн для первых 6 фото как в вашем примере
const spanClasses = [
    'col-span-4', // 01
    'col-span-2', // 02
    'col-span-2', // 03
    'col-span-2', // 04
    'col-span-2', // 05
    'col-span-4', // 06
    'col-span-2', // 06
    'col-span-2', // 06
    'col-span-2', // 06
    'col-span-2', // 06
];

export default function PhotoGallery() {
    const [photos, setPhotos] = useState<PhotoWithDimensions[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadImageDimensions() {
            try {
                const photosWithDimensions = await Promise.all(
                    photoFiles.map(async (file) => {
                        const src = `/gallery/common/${file}`;

                        return new Promise<PhotoWithDimensions>((resolve) => {
                            const img = document.createElement('img');

                            img.onload = () => {
                                resolve({
                                    file,
                                    width: img.width,
                                    height: img.height,
                                });
                            };

                            img.onerror = () => {
                                console.error(`Failed to load image: ${src}`);
                                resolve({
                                    file,
                                    width: 1200,
                                    height: 800,
                                });
                            };

                            img.src = src;
                        });
                    })
                );
                setPhotos(photosWithDimensions);
            } catch (error) {
                console.error('Error loading images:', error);
            } finally {
                setLoading(false);
            }
        }

        loadImageDimensions();
    }, []);

    if (loading) {
        return (
            <div className="w-full p-4">
                <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {spanClasses.map((span, i) => (
                        <div
                            key={i}
                            className={`${span} aspect-[4/3] bg-gray-200 animate-pulse rounded-lg`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4">
            <Gallery>
                <div className="grid grid-cols-8 gap-2 w-full mx-auto px-6">
                    {photos.map((photo, index) => (
                        <div
                            key={photo.file}
                            className={`${spanClasses[index]} relative group overflow-hidden rounded-lg`}
                        >
                            <Item
                                original={`/gallery/common/${photo.file}`}
                                thumbnail={`/gallery/common/${photo.file}`}
                                width={photo.width}
                                height={photo.height}
                                alt={`Altai view ${index + 1}`}
                            >
                                {({ ref, open }) => (
                                    <div
                                        ref={ref}
                                        onClick={open}
                                        className="relative h-72 cursor-pointer"
                                    >
                                        <Image
                                            src={`/gallery/common/${photo.file}`}
                                            alt={`Altai view ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                        />

                                    </div>
                                )}
                            </Item>
                        </div>
                    ))}
                </div>
            </Gallery>
        </div>
    );
}