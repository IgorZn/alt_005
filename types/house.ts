// types/house.ts
import type { House, Photo, Amenity, HouseAmenity, AmenityCategory } from '@/generated/prisma/client';

// Расширенные типы для использования с отношениями
export type HouseWithAmenities = House & {
    amenities: (HouseAmenity & {
        amenity: Amenity & {
            category: AmenityCategory;
        };
    })[];
    photos: Photo[];
};

export type HouseCardData = Pick<House, 'id' | 'title' | 'capacity' | 'area' | 'price'> & {
    photos: Pick<Photo, 'url' | 'isMain'>[];
};

export type HouseDetailData = House & {
    amenities: (HouseAmenity & {
        amenity: Amenity & {
            category: AmenityCategory;
        };
    })[];
    photos: Photo[];
};