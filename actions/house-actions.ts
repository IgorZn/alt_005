// actions/house-actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { HouseWithAmenities, HouseCardData, HouseDetailData } from '@/types/house';
import { revalidatePath } from 'next/cache';
import {House} from "@/generated/prisma/client";

// Получить все дома для карточек
export async function getHousesForCards(): Promise<HouseCardData[]> {
    try {
        const houses = await prisma.house.findMany({
            where: { isAvailable: true },
            select: {
                id: true,
                title: true,
                capacity: true,
                area: true,
                price: true,
                photos: {
                    select: {
                        url: true,
                        isMain: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });

        return houses;
    } catch (error) {
        console.error('Error fetching houses:', error);
        return [];
    }
}

// Получить детальную информацию о доме
export async function getHouseById(id: number): Promise<HouseDetailData | null> {
    try {
        const house = await prisma.house.findUnique({
            where: { id },
            include: {
                amenities: {
                    include: {
                        amenity: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                photos: {
                    orderBy: {
                        isMain: 'desc',
                    },
                },
            },
        });

        return house;
    } catch (error) {
        console.error(`Error fetching house ${id}:`, error);
        return null;
    }
}

// Получить все удобства с категориями
export async function getAllAmenities() {
    try {
        const amenities = await prisma.amenity.findMany({
            include: {
                category: true,
            },
            orderBy: [
                { categoryId: 'asc' },
                { name: 'asc' },
            ],
        });

        return amenities;
    } catch (error) {
        console.error('Error fetching amenities:', error);
        return [];
    }
}

// CRUD операции для админки (если нужны)
export async function createHouse(data: Omit<House, 'id'>) {
    try {
        const house = await prisma.house.create({
            data,
        });
        revalidatePath('/houses');
        revalidatePath('/admin/houses');
        return { success: true, house };
    } catch (error) {
        console.error('Error creating house:', error);
        return { success: false, error: 'Failed to create house' };
    }
}

export async function updateHouse(id: number, data: Partial<House>) {
    try {
        const house = await prisma.house.update({
            where: { id },
            data,
        });
        revalidatePath('/houses');
        revalidatePath(`/houses/${id}`);
        revalidatePath('/admin/houses');
        return { success: true, house };
    } catch (error) {
        console.error(`Error updating house ${id}:`, error);
        return { success: false, error: 'Failed to update house' };
    }
}

export async function deleteHouse(id: number) {
    try {
        await prisma.house.delete({
            where: { id },
        });
        revalidatePath('/houses');
        revalidatePath('/admin/houses');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting house ${id}:`, error);
        return { success: false, error: 'Failed to delete house' };
    }
}