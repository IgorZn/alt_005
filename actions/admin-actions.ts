// actions/admin-actions.ts
'use server';

import { getServerSession } from 'next-auth';
import { AUTH_OPTIONS } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type {
    HouseActionResponse,
    PhotoActionResponse
} from '@/types/dashboard';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createHouse, updateHouse } from './house-actions';
import type { House } from '@/generated/prisma/client';

// Схема валидации для дома
const houseSchema = z.object({
    title: z.string().min(1, 'Название обязательно'),
    subtitle: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    capacity: z.coerce.number().min(1, 'Вместимость должна быть не менее 1'),
    area: z.coerce.number().min(1, 'Площадь должна быть не менее 1'),
    rooms: z.coerce.number().min(1, 'Количество комнат должно быть не менее 1'),
    price: z.coerce.number().min(0, 'Цена должна быть положительной').optional().nullable(),
    petFee: z.coerce.number().min(0, 'Плата за питомцев должна быть положительной').optional().nullable(),
    maxPets: z.coerce.number().min(0, 'Максимум питомцев должен быть положительным').optional().nullable(),
    smokingAllowed: z.preprocess(
        (val) => val === 'on' || val === true,
        z.boolean().default(false)
    ),
    isAvailable: z.preprocess(
        (val) => val === 'on' || val === true,
        z.boolean().default(true)
    ),
    amenityIds: z.array(z.coerce.number()).optional().default([]),
});

// Тип для данных формы после валидации
type HouseFormData = z.infer<typeof houseSchema>;

// Тип для данных дома без id (для создания)
type HouseCreateData = Omit<House, 'id'>;

// Получить все дома для админки
export async function getAdminHouses() {
    try {
        return prisma.house.findMany({
            include: {
                photos: {
                    where: { isMain: true },
                    take: 1,
                },
                _count: {
                    select: { bookings: true },
                },
            },
            orderBy: { id: 'asc' },
        });
    } catch (error) {
        console.error('Error fetching admin houses:', error);
        return [];
    }
}

// Получить дом для редактирования
export async function getHouseForEdit(id: number) {
    try {
        return prisma.house.findUnique({
            where: { id },
            include: {
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
                photos: {
                    orderBy: { isMain: 'desc' },
                },
            },
        });
    } catch (error) {
        console.error(`Error fetching house ${id} for edit:`, error);
        return null;
    }
}

// Создание дома с фото
export async function createHouseWithPhotos(formData: FormData): Promise<HouseActionResponse> {
    const session = await getServerSession(AUTH_OPTIONS);

    // @ts-expect-error
    if (!session?.user?.isAdmin) {
        return { success: false, error: 'Доступ запрещен' };
    }

    try {
        // Парсим данные
        const rawData = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle') || null,
            description: formData.get('description') || null,
            capacity: formData.get('capacity'),
            area: formData.get('area'),
            rooms: formData.get('rooms'),
            price: formData.get('price') || null,
            petFee: formData.get('petFee') || null,
            maxPets: formData.get('maxPets') || null,
            smokingAllowed: formData.get('smokingAllowed'),
            isAvailable: formData.get('isAvailable'),
            amenityIds: formData.getAll('amenityIds'),
        };

        // Валидация
        const validatedData = houseSchema.safeParse(rawData);

        if (!validatedData.success) {
            const fieldErrors: Record<string, string> = {};
            validatedData.error.issues.forEach((issue) => {
                if (issue.path.length > 0) {
                    fieldErrors[issue.path[0].toString()] = issue.message;
                }
            });
            return { success: false, error: 'Ошибка валидации', fieldErrors };
        }

        // Данные после валидации
        const data: HouseFormData = validatedData.data;

        // Подготавливаем данные для создания дома
        const { title, amenityIds, ...restData } = data;

        const houseData: HouseCreateData = {
            title,
            subtitle: restData.subtitle ?? null,
            description: restData.description ?? null,
            capacity: restData.capacity,
            area: restData.area,
            rooms: restData.rooms,
            price: restData.price ?? null,
            petFee: restData.petFee ?? null,
            maxPets: restData.maxPets ?? null,
            smokingAllowed: restData.smokingAllowed,
            isAvailable: restData.isAvailable,
        };

        const result = await createHouse(houseData);

        if (!result.success || !result.house) {
            return { success: false, error: result.error || 'Ошибка при создании дома' };
        }

        // Добавляем удобства
        if (amenityIds && amenityIds.length > 0) {
            await prisma.houseAmenity.createMany({
                data: amenityIds.map(amenityId => ({
                    houseId: result.house!.id,
                    amenityId,
                    isAvailable: true,
                })),
            });
        }

        // Сохраняем фото
        const photos = formData.getAll('photos') as File[];
        if (photos.length > 0) {
            await saveHousePhotos(result.house.id, photos);
        }

        revalidatePath('/dashboard/houses');
        return { success: true, data: result.house };
    } catch (error) {
        console.error('Error creating house with photos:', error);
        return { success: false, error: 'Ошибка при создании дома' };
    }
}

// Обновление дома с фото
export async function updateHouseWithPhotos(id: number, formData: FormData): Promise<HouseActionResponse> {
    try {
        const rawData = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle') || null,
            description: formData.get('description') || null,
            capacity: formData.get('capacity'),
            area: formData.get('area'),
            rooms: formData.get('rooms'),
            price: formData.get('price') || null,
            petFee: formData.get('petFee') || null,
            maxPets: formData.get('maxPets') || null,
            smokingAllowed: formData.get('smokingAllowed'),
            isAvailable: formData.get('isAvailable'),
            amenityIds: formData.getAll('amenityIds'),
        };

        const validatedData = houseSchema.safeParse(rawData);

        if (!validatedData.success) {
            const fieldErrors: Record<string, string> = {};
            validatedData.error.issues.forEach((issue) => {
                if (issue.path.length > 0) {
                    fieldErrors[issue.path[0].toString()] = issue.message;
                }
            });
            return { success: false, error: 'Ошибка валидации', fieldErrors };
        }

        const data: HouseFormData = validatedData.data;

        // Подготавливаем данные для обновления дома
        const { title, amenityIds, ...restData } = data;

        const houseData: Partial<House> = {
            title,
            subtitle: restData.subtitle ?? null,
            description: restData.description ?? null,
            capacity: restData.capacity,
            area: restData.area,
            rooms: restData.rooms,
            price: restData.price ?? null,
            petFee: restData.petFee ?? null,
            maxPets: restData.maxPets ?? null,
            smokingAllowed: restData.smokingAllowed,
            isAvailable: restData.isAvailable,
        };

        const result = await updateHouse(id, houseData);

        if (!result.success) {
            return { success: false, error: result.error || 'Ошибка при обновлении дома' };
        }

        // Обновляем удобства (удаляем старые, добавляем новые)
        await prisma.houseAmenity.deleteMany({
            where: { houseId: id },
        });

        if (amenityIds && amenityIds.length > 0) {
            await prisma.houseAmenity.createMany({
                data: amenityIds.map(amenityId => ({
                    houseId: id,
                    amenityId,
                    isAvailable: true,
                })),
            });
        }

        // Сохраняем новые фото
        const photos = formData.getAll('newPhotos') as File[];
        if (photos.length > 0) {
            await saveHousePhotos(id, photos);
        }

        revalidatePath('/dashboard/houses');
        revalidatePath(`/prozhivanie/${id}`);

        if (!result.house) {
            return { success: false, error: 'Дом не найден после обновления' };
        }

        return { success: true, data: result.house };
    } catch (error) {
        console.error(`Error updating house ${id} with photos:`, error);
        return { success: false, error: 'Ошибка при обновлении дома' };
    }
}

// Удаление фото
export async function deleteHousePhoto(photoId: number): Promise<PhotoActionResponse> {
    try {
        const photo = await prisma.photo.delete({
            where: { id: photoId },
        });
        return { success: true, data: photo };
    } catch (error) {
        console.error(`Error deleting photo ${photoId}:`, error);
        return { success: false, error: 'Ошибка при удалении фото' };
    }
}

// Вспомогательная функция для сохранения фото
async function saveHousePhotos(houseId: number, photos: File[]) {
    const folderNumber = houseId.toString().padStart(2, '0');
    const uploadDir = path.join(process.cwd(), 'public', 'gallery', 'houses', folderNumber);

    // Создаем папку, если её нет
    await mkdir(uploadDir, { recursive: true });

    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Генерируем имя файла
        const fileName = `h${houseId}_${(i + 1).toString().padStart(2, '0')}.jpg`;
        const filePath = path.join(uploadDir, fileName);

        // Сохраняем файл
        await writeFile(filePath, buffer);

        // Проверяем, есть ли уже фото у этого дома
        const existingPhotosCount = await prisma.photo.count({
            where: { houseId },
        });

        // Сохраняем запись в БД
        await prisma.photo.create({
            data: {
                url: `/gallery/houses/${folderNumber}/${fileName}`,
                houseId,
                isMain: existingPhotosCount === 0 && i === 0, // Первое фото - главное
            },
        });
    }
}