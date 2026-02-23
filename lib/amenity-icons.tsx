// lib/amenity-icons.tsx
import {
    Dog, Wifi, Wind, Coffee, Thermometer, ShowerHead,
    Droplets, Scan, Fence, TreePine, Waves, BedSingle,
    BedDouble, Bath, Tv, Smartphone, Refrigerator,
    Microwave, ChefHat, Utensils, Armchair, Lamp,
    Lock, Car, Tent, Mountain, Bird,
} from 'lucide-react';

export const amenityIconMap: Record<string, React.ReactNode> = {
    // Животные
    "Можно с питомцами": <Dog className="w-5 h-5" />,

    // Интернет
    "Wi-Fi": <Wifi className="w-5 h-5" />,
    "Wi-Fi. Интернет": <Wifi className="w-5 h-5" />,

    // Электроника
    "Фен": <Wind className="w-5 h-5" />,
    "Чайник": <Coffee className="w-5 h-5" />,
    "Обогреватели": <Thermometer className="w-5 h-5" />,
    "Телевизор": <Tv className="w-5 h-5" />,
    "Холодильник": <Refrigerator className="w-5 h-5" />,
    "Микроволновка": <Microwave className="w-5 h-5" />,
    "Плита": <ChefHat className="w-5 h-5" />,
    "Посуда": <Utensils className="w-5 h-5" />,

    // Ванная
    "Душ": <ShowerHead className="w-5 h-5" />,
    "Полотенца": <Droplets className="w-5 h-5" />,
    "Раковина": <Droplets className="w-5 h-5" />,
    "Водонагреватель": <Thermometer className="w-5 h-5" />,
    "Туалетные средства": <Droplets className="w-5 h-5" />,
    "Туалет (совмещенный)": <Bath className="w-5 h-5" />,
    "Унитаз": <Bath className="w-5 h-5" />,
    "Ванна": <Bath className="w-5 h-5" />,

    // Окна и вид
    "Панорамные окна": <Scan className="w-5 h-5" />,
    "Вид во двор": <TreePine className="w-5 h-5" />,
    "Вид на озеро": <Waves className="w-5 h-5" />,
    "Вид на горы": <Mountain className="w-5 h-5" />,
    "Вид на лес": <TreePine className="w-5 h-5" />,

    // Территория
    "Частный двор": <Fence className="w-5 h-5" />,
    "Мангал": <Flame className="w-5 h-5" />,
    "Парковка": <Car className="w-5 h-5" />,
    "Беседка": <Tent className="w-5 h-5" />,

    // Кровати
    "1 односпальная кровать": <BedSingle className="w-5 h-5" />,
    "2 односпальные кровати": <div className="flex"><BedSingle className="w-5 h-5" /><BedSingle className="w-5 h-5 -ml-1" /></div>,
    "1 двуспальная кровать": <BedDouble className="w-5 h-5" />,
    "Диван-кровать": <Armchair className="w-5 h-5" />,

    // Мебель
    "Стол": <Utensils className="w-5 h-5" />,
    "Стулья": <Armchair className="w-5 h-5" />,
    "Шкаф": <Armchair className="w-5 h-5" />,
    "Вешалка": <Armchair className="w-5 h-5" />,

    // Природа
    "Птицы": <Bird className="w-5 h-5" />,
    "Лебеди": <Bird className="w-5 h-5" />,
    "Утки": <Bird className="w-5 h-5" />,
};

// Добавляем недостающий импорт
import { Flame } from 'lucide-react';