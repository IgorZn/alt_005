// components/QuickActions.tsx
'use client';

import { Phone, MapPin } from 'lucide-react';

export default function QuickActions() {
    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
            <a
                href="tel:+79139965777"
                className="flex items-center justify-center w-14 h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                aria-label="Позвонить"
            >
                <Phone className="w-6 h-6" />
            </a>
            <a
                href="https://yandex.ru/maps/?text=Республика%20Алтай%2C%20Кош-Агач%2C%20Изумрудная%20улица%2C%201"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                aria-label="Открыть на карте"
            >
                <MapPin className="w-6 h-6" />
            </a>
        </div>
    );
}