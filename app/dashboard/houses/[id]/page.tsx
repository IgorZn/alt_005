// app/dashboard/houses/[id]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import HouseForm from '@/components/dashboard/HouseForm';

interface EditHousePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditHousePage({ params }: EditHousePageProps) {
    const { id } = await params;
    const houseId = parseInt(id);

    if (isNaN(houseId)) {
        notFound();
    }

    const house = await prisma.house.findUnique({
        where: { id: houseId },
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
            photos: true,
        },
    });

    if (!house) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Редактирование дома: {house.title}
            </h1>
            <HouseForm house={house} />
        </div>
    );
}