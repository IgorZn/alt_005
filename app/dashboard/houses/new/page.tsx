// app/dashboard/houses/new/page.tsx
import HouseForm from '@/components/dashboard/HouseForm';

export default function NewHousePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Создание нового дома
            </h1>
            <HouseForm />
        </div>
    );
}