// prisma/seed-img.ts
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

// Функция для получения списка файлов из папки
function getImagesFromFolder(folderPath: string): string[] {
    try {
        const fullPath = path.join(process.cwd(), 'public', folderPath);
        console.log(`📁 Проверяем папку: ${fullPath}`);

        if (!fs.existsSync(fullPath)) {
            console.log(`⚠️  Папка не существует: ${folderPath}`);
            return [];
        }

        const files = fs.readdirSync(fullPath);
        // Фильтруем только изображения (можно расширить список расширений)
        const images = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file)
        ).sort(); // Сортируем для консистентности

        console.log(`  Найдено ${images.length} изображений`);
        return images;
    } catch (error) {
        console.error(`❌ Ошибка при чтении папки ${folderPath}:`, error);
        return [];
    }
}

// Функция для создания фотографий для конкретного дома
async function updateHousePhotos(houseId: number, houseIndex: number) {
    // Формируем номер папки с ведущим нулем (01, 02, 03, ...)
    const folderNumber = (houseIndex + 1).toString().padStart(2, '0');
    const folderPath = `/gallery/houses/${folderNumber}/`;

    console.log(`\n🏠 Обработка дома ${houseIndex + 1} (ID: ${houseId}) - папка ${folderNumber}`);

    // Получаем список изображений из папки
    const imageFiles = getImagesFromFolder(folderPath);

    if (imageFiles.length === 0) {
        console.log(`⚠️  Нет изображений для дома ${houseIndex + 1}`);
        return;
    }

    // Удаляем старые фотографии дома
    await prisma.photo.deleteMany({
        where: { houseId }
    });
    console.log(`  🗑️  Удалены старые фотографии`);

    // Создаем новые фотографии
    const photos = imageFiles.map((file, index) => ({
        url: `${folderPath}${file}`,
        houseId,
        isMain: index === 0, // Первое фото - главное
    }));

    const createdPhotos = await prisma.photo.createMany({
        data: photos
    });

    console.log(`  ✅ Добавлено ${createdPhotos.count} новых фотографий`);
    console.log(`  📸 Файлы: ${imageFiles.slice(0, 3).join(', ')}${imageFiles.length > 3 ? '...' : ''}`);
}

async function main() {
    console.log('🚀 Запуск обновления фотографий домов...');
    console.log('==========================================');

    try {
        // Получаем все дома из базы данных
        const houses = await prisma.house.findMany({
            orderBy: { id: 'asc' }
        });

        console.log(`📊 Найдено домов в базе: ${houses.length}`);

        if (houses.length === 0) {
            console.log('❌ В базе нет домов. Сначала запустите основной seed.');
            return;
        }

        // Обновляем фотографии для каждого дома
        for (let i = 0; i < houses.length; i++) {
            const house = houses[i];
            await updateHousePhotos(house.id, i);
        }

        // Проверяем результат
        const totalPhotos = await prisma.photo.count();
        const housesWithPhotos = await prisma.house.count({
            where: {
                photos: {
                    some: {}
                }
            }
        });

        console.log('\n==========================================');
        console.log('📊 Итоговая статистика:');
        console.log(`  • Всего домов: ${houses.length}`);
        console.log(`  • Домов с фото: ${housesWithPhotos}`);
        console.log(`  • Всего фотографий: ${totalPhotos}`);
        console.log(`  • Среднее фото на дом: ${(totalPhotos / houses.length).toFixed(1)}`);
        console.log('==========================================');

        console.log('\n✨ Обновление фотографий завершено!');

    } catch (error) {
        console.error('❌ Ошибка при обновлении фотографий:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт
main();