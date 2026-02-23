// components/WelcomeSection.tsx
'use client';

import Image from 'next/image';
import { Quote } from 'lucide-react';

export default function WelcomeSection() {
    return (
        <section className="w-full py-20 px-4 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-black">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Левая колонка с текстом */}
                    <div className="space-y-8 relative">
                        <div className="absolute -top-6 -left-6 text-amber-200 dark:text-amber-900/30">
                            <Quote size={80} />
                        </div>

                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                                <span className="text-amber-600 dark:text-amber-500">Алтай Paradise</span>
                                <br />
                                <span className="text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-400">
                                    ваш идеальный отдых
                                </span>
                            </h1>

                            <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                <p className="flex items-start gap-3">
                                    <span className="inline-block w-2 h-2 mt-2.5 bg-amber-500 rounded-full flex-shrink-0" />
                                    <span>Находится в черте села Кош-Агач, вдали от жилых застроек и автодорог, в тихом, чистом, красивом месте.</span>
                                </p>

                                <p className="flex items-start gap-3">
                                    <span className="inline-block w-2 h-2 mt-2.5 bg-amber-500 rounded-full flex-shrink-0" />
                                    <span>Можно наблюдать красивейший рассвет и закат самого южного района нашей республики.</span>
                                </p>

                                <p className="flex items-start gap-3">
                                    <span className="inline-block w-2 h-2 mt-2.5 bg-amber-500 rounded-full flex-shrink-0" />
                                    <span>Как бальзам для ваших ушей здесь выступают разнообразная вокализация птиц, шелест ручейка.</span>
                                </p>

                                <p className="flex items-start gap-3">
                                    <span className="inline-block w-2 h-2 mt-2.5 bg-amber-500 rounded-full flex-shrink-0" />
                                    <span>В шаговой доступности находится озеро, где обязательно встретите семейства белых лебедей, журавлей, уток.</span>
                                </p>
                            </div>

                            <div className="mt-10 p-6 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border-l-4 border-amber-500">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white italic">
                                    &quot;Если Вы ищете уют, тепло, простор – тогда Вам к нам!&quot;
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка с изображением */}
                    <div className="relative">
                        <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/gallery/common/alt_view_014.jpg" // Выберите подходящее фото
                                alt="Алтай Paradise - живописный вид"
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Декоративные элементы */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="text-sm uppercase tracking-wider opacity-80">
                                    Добро пожаловать
                                </p>
                                <p className="text-2xl font-semibold">
                                    в Алтай Paradise
                                </p>
                            </div>
                        </div>

                        {/* Декоративный элемент позади фото */}
                        <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-amber-200/50 dark:bg-amber-900/20 rounded-2xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}