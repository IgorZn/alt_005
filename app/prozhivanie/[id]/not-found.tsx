// app/prozhivanie/[id]/not-found.tsx
import Link from 'next/link';

export default function HouseNotFound() {
    return (
        <div className="w-full min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Дом не найден
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Запрошенный дом не существует или был удален
                </p>
                <Link
                    href="/prozhivanie"
                    className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
                >
                    Вернуться к списку домов
                </Link>
            </div>
        </div>
    );
}