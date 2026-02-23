// app/contacts/page.tsx
'use client';

import { Phone, MapPin, Mail, Clock, Calendar, Instagram, Send } from 'lucide-react';

export default function ContactsPage() {
    return (
        <div className="w-full min-h-screen bg-white dark:bg-black">
            {/* Hero секция с заголовком */}
            <div className="bg-gradient-to-r from-amber-50 to-white dark:from-gray-900 dark:to-black py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Контакты
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Свяжитесь с нами любым удобным способом
                    </p>
                </div>
            </div>

            {/* Основной контент */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Левая колонка - контактная информация */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                            Наши контакты
                        </h2>

                        {/* Период работы - выделенный блок */}
                        <div className="flex items-start gap-4 p-6 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border-2 border-amber-200 dark:border-amber-800">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Сезон работы
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-xl font-semibold">
                                    турбаза &quot;Алтай Paradise&quot; работает
                                </p>
                                <p className="text-amber-600 dark:text-amber-400 text-2xl font-bold mt-1">
                                    с мая по сентябрь
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                    Ждем вас в теплое время года!
                                </p>
                            </div>
                        </div>

                        {/* Адрес */}
                        <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Адрес
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    с. Кош-Агач, ул. Изумрудная, дом 1<br />
                                    Республика Алтай, Россия
                                </p>
                                <a
                                    href="https://yandex.ru/maps/?ll=88.123456,49.123456&z=15&text=Республика%20Алтай%2C%20Кош-Агач%2C%20Изумрудная%20улица%2C%201"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-3 text-amber-600 dark:text-amber-400 hover:underline"
                                >
                                    Открыть на карте →
                                </a>
                            </div>
                        </div>

                        {/* Телефон */}
                        <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                <Phone className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Телефон
                                </h3>
                                <a
                                    href="tel:+79139965777"
                                    className="text-gray-600 dark:text-gray-400 text-2xl font-semibold hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                >
                                    8-913-996-57-77
                                </a>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                    Ежедневно с 9:00 до 22:00
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                <Mail className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Email
                                </h3>
                                <a
                                    href="mailto:info@altaiparadise.ru"
                                    className="text-gray-600 dark:text-gray-400 text-lg hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                >
                                    info@altaiparadise.ru
                                </a>
                            </div>
                        </div>

                        {/* Время работы */}
                        <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Часы работы
                                </h3>
                                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                                    <p>Пн-Пт: 9:00 - 22:00</p>
                                    <p>Сб-Вс: 10:00 - 23:00</p>
                                </div>
                                <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                                    * В сезон с мая по сентябрь
                                </p>
                            </div>
                        </div>

                        {/* Социальные сети */}
                        <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                <Instagram className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Мы в соцсетях
                                </h3>
                                <div className="flex gap-4">
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                    >
                                        <Instagram className="w-5 h-5" />
                                        <span>Instagram</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                        <span>Telegram</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - карта */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                            Как нас найти
                        </h2>

                        <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl">
                            {/* Яндекс Карта */}
                            <iframe
                                src="https://yandex.ru/map-widget/v1/?ll=88.123456%2C49.123456&z=15&l=map&pt=88.123456,49.123456,pm2rdm&text=Республика%20Алтай%2C%20Кош-Агач%2C%20Изумрудная%20улица%2C%201"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                className="absolute inset-0"
                            />
                        </div>

                        {/* Кнопка для построения маршрута */}
                        <a
                            href="https://yandex.ru/maps/?rtext=~49.123456,88.123456&rtt=auto"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full text-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                        >
                            Построить маршрут
                        </a>

                        {/* Дополнительная информация о сезоне */}
                        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Бронирование на сезон {new Date().getFullYear()} года
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Открыто бронирование на летний сеон {new Date().getFullYear()} года.
                                Успейте забронировать удобные даты!
                            </p>
                            <a
                                href="/ru/booking"
                                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
                            >
                                Забронировать
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}