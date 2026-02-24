// types/dashboard.ts
import type { House, Photo } from '@/generated/prisma/client';

// Тип для списка домов в админке
export type AdminHouseListItem = House & {
    photos: Photo[];
    _count: {
        bookings: number;
    };
};

// Тип для формы дома
export type HouseFormData = {
    title: string;
    subtitle?: string | null;
    description?: string | null;
    capacity: number;
    area: number;
    rooms: number;
    price?: number | null;
    petFee?: number | null;
    maxPets?: number | null;
    smokingAllowed: boolean;
    isAvailable: boolean;
    amenityIds: number[];
};

// Тип для успешного ответа с данными
export type SuccessResponse<T> = {
    success: true;
    data: T;
    error?: never;
    fieldErrors?: never;
};

// Тип для успешного ответа без данных
export type SuccessResponseWithoutData = {
    success: true;
    data?: never;
    error?: never;
    fieldErrors?: never;
};

// Тип для ответа с ошибкой
export type ErrorResponse = {
    success: false;
    error: string;
    fieldErrors?: Record<string, string>;
    data?: never;
};

// Тип для ответа от сервера с данными (объединение)
export type ActionResponse<T = never> =
    | SuccessResponse<T>
    | ErrorResponse;

// Тип для ответа без данных
export type ActionResponseWithoutData =
    | SuccessResponseWithoutData
    | ErrorResponse;

// Специализированные типы для разных операций
export type HouseActionResponse = ActionResponse<House>;
export type HousesListResponse = ActionResponse<AdminHouseListItem[]>;
export type DeleteActionResponse = ActionResponseWithoutData;
export type PhotoActionResponse = ActionResponse<Photo>;