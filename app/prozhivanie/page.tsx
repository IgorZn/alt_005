// app/prozhivanie/page.tsx
import { getHousesForCards } from '@/actions/house-actions';
import HouseCard from '@/components/HouseCard';

export default async function HousesPage() {
    const houses = await getHousesForCards();

    return (
        <div className="w-full min-h-screen bg-white dark:bg-black">
            {/* Hero секция */}
            <div className="bg-gradient-to-r from-amber-50 to-white dark:from-gray-900 dark:to-black py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Наши дома
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Уютные деревянные дома для вашего отдыха
                    </p>
                </div>
            </div>

            {/* Список домов */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {houses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Нет доступных домов
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {houses.map((house) => (
                            <HouseCard key={house.id} house={house} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}