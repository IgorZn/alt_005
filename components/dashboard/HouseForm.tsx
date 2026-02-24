// components/dashboard/HouseForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createHouseWithPhotos, updateHouseWithPhotos, deleteHousePhoto } from '@/actions/admin-actions';
import { getAllAmenities } from '@/actions/house-actions';
import type { Amenity } from '@/generated/prisma/client';
import type { HouseWithRelations } from '@/types/house';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { X, Upload, Loader2 } from 'lucide-react';

interface HouseFormProps {
    house?: HouseWithRelations;
}

export default function HouseForm({ house }: HouseFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<Set<number>>(new Set());
    const [photos, setPhotos] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Загружаем список всех удобств
    useEffect(() => {
        async function loadAmenities() {
            const data = await getAllAmenities();
            setAmenities(data as Amenity[]);
        }
        loadAmenities();
    }, []);

    // Устанавливаем выбранные удобства для редактирования
    useEffect(() => {
        if (house) {
            const amenityIds = new Set(house.amenities.map(ha => ha.amenityId));
            setSelectedAmenities(amenityIds);
        }
    }, [house]);

    // Очищаем превью при размонтировании
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    // Обработка выбора фото
    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setPhotos(prev => [...prev, ...files]);

        // Создаем превью
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    // Удаление фото из списка новых
    const removeNewPhoto = (index: number) => {
        URL.revokeObjectURL(previewUrls[index]);
        setPhotos(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    // Удаление существующего фото
    const handleDeleteExistingPhoto = async (photoId: number) => {
        if (!confirm('Удалить фото?')) return;

        const result = await deleteHousePhoto(photoId);
        if (result.success) {
            toast.success('Фото удалено');
            router.refresh();
        } else {
            toast.error(result.error || 'Ошибка при удалении фото');
        }
    };

    // Отправка формы
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Добавляем выбранные удобства
        selectedAmenities.forEach(id => {
            formData.append('amenityIds', id.toString());
        });

        // Добавляем фото
        photos.forEach(photo => {
            formData.append(house ? 'newPhotos' : 'photos', photo);
        });

        let result;
        if (house) {
            result = await updateHouseWithPhotos(house.id, formData);
        } else {
            result = await createHouseWithPhotos(formData);
        }

        setLoading(false);

        if (result.success) {
            toast.success(house ? 'Дом обновлен' : 'Дом создан');
            router.push('/dashboard/houses');
            router.refresh();
        } else {
            toast.error(result.error || 'Ошибка при сохранении');
            if (result.fieldErrors) {
                // Показываем ошибки валидации
                Object.entries(result.fieldErrors).forEach(([field, message]) => {
                    toast.error(`${field}: ${message}`);
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Основная информация */}
            <Card>
                <CardHeader>
                    <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Название *</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={house?.title}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Подзаголовок</Label>
                            <Input
                                id="subtitle"
                                name="subtitle"
                                defaultValue={house?.subtitle || ''}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={house?.description || ''}
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">Вместимость (чел) *</Label>
                            <Input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="1"
                                defaultValue={house?.capacity || 1}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="area">Площадь (м²) *</Label>
                            <Input
                                id="area"
                                name="area"
                                type="number"
                                min="1"
                                defaultValue={house?.area || 1}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rooms">Комнат *</Label>
                            <Input
                                id="rooms"
                                name="rooms"
                                type="number"
                                min="1"
                                defaultValue={house?.rooms || 1}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Цена (₽/сутки)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                defaultValue={house?.price || ''}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Дополнительные опции */}
            <Card>
                <CardHeader>
                    <CardTitle>Дополнительные опции</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="petFee">Плата за питомцев (₽/сутки)</Label>
                            <Input
                                id="petFee"
                                name="petFee"
                                type="number"
                                min="0"
                                defaultValue={house?.petFee || ''}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxPets">Макс. питомцев</Label>
                            <Input
                                id="maxPets"
                                name="maxPets"
                                type="number"
                                min="0"
                                defaultValue={house?.maxPets || ''}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="smokingAllowed"
                                name="smokingAllowed"
                                defaultChecked={house?.smokingAllowed}
                            />
                            <Label htmlFor="smokingAllowed">Разрешено курение</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isAvailable"
                                name="isAvailable"
                                defaultChecked={house?.isAvailable ?? true}
                            />
                            <Label htmlFor="isAvailable">Доступен для бронирования</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Удобства */}
            <Card>
                <CardHeader>
                    <CardTitle>Удобства</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
                        {amenities.map((amenity) => (
                            <div key={amenity.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`amenity-${amenity.id}`}
                                    checked={selectedAmenities.has(amenity.id)}
                                    onCheckedChange={(checked) => {
                                        const newSet = new Set(selectedAmenities);
                                        if (checked) {
                                            newSet.add(amenity.id);
                                        } else {
                                            newSet.delete(amenity.id);
                                        }
                                        setSelectedAmenities(newSet);
                                    }}
                                />
                                <Label htmlFor={`amenity-${amenity.id}`} className="text-sm">
                                    {amenity.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Фотографии */}
            <Card>
                <CardHeader>
                    <CardTitle>Фотографии</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Существующие фото */}
                    {house?.photos && house.photos.length > 0 && (
                        <div>
                            <Label>Текущие фото</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                {house.photos.map((photo) => (
                                    <div key={photo.id} className="relative group">
                                        <div className="relative aspect-square rounded-lg overflow-hidden">
                                            <Image
                                                src={photo.url}
                                                alt={house.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteExistingPhoto(photo.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Удалить фото"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {photo.isMain && (
                                            <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                                                MAIN
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Загрузка новых фото */}
                    <div>
                        <Label htmlFor="photos">Добавить новые фото</Label>
                        <div className="mt-2">
                            <input
                                type="file"
                                id="photos"
                                name="photos"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('photos')?.click()}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Выбрать фото
                            </Button>
                        </div>

                        {/* Превью новых фото */}
                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <div className="relative aspect-square rounded-lg overflow-hidden">
                                            <Image
                                                src={url}
                                                alt={`preview ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeNewPhoto(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Удалить"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Кнопки */}
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/houses')}
                >
                    Отмена
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {loading ? 'Сохранение...' : house ? 'Сохранить' : 'Создать'}
                </Button>
            </div>
        </form>
    );
}