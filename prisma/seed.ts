// prisma/seed.ts
import {PrismaClient, Prisma} from "../generated/prisma/client";
import {PrismaPg} from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
    adapter,
});

// 1. Сначала создаем категории
const categories = [
    { name: "Размещение с питомцами", order: 1, icon: "dog" },
    { name: "Видео/аудио", order: 2, icon: "tv" },
    { name: "Интернет/телефония", order: 3, icon: "wifi" },
    { name: "Электроника", order: 4, icon: "cpu" },
    { name: "Ванная комната", order: 5, icon: "bath" },
    { name: "Внешняя территория и вид из окон", order: 6, icon: "tree-pine" },
    { name: "Кровати", order: 7, icon: "bed" },
    { name: "Мебель", order: 8, icon: "armchair" },
    { name: "Прочее", order: 9, icon: "circle-ellipsis" }
];

// 2. Затем удобства с привязкой к категориям
const amenities = [
    // Категория 1: Размещение с питомцами
    {name: "Можно с питомцами", categoryId: 1},

    // Категория 3: Интернет/телефония
    {name: "Wi-Fi. Интернет", categoryId: 3},

    // Категория 4: Электроника
    {name: "Фен", categoryId: 4},
    {name: "Чайник", categoryId: 4},
    {name: "Обогреватели", categoryId: 4},

    // Категория 5: Ванная комната
    {name: "Душ", categoryId: 5},
    {name: "Полотенца", categoryId: 5},
    {name: "Раковина", categoryId: 5},
    {name: "Водонагреватель", categoryId: 5},
    {name: "Туалетные средства/зубные принадлежности", categoryId: 5},
    {name: "Туалет (совмещенный)", categoryId: 5},
    {name: "Унитаз", categoryId: 5},

    // Категория 6: Внешняя территория и вид из окон
    {name: "Панорамные окна", categoryId: 6},
    {name: "Частный двор", categoryId: 6},
    {name: "Вид во двор", categoryId: 6},

    // Категория 7: Кровати
    {name: "1 односпальная кровать", categoryId: 7},
    {name: "1 двуспальная кровать", categoryId: 7},

];

function getBaseAmenities() {
    return [
        {amenity: {connect: {name: "Можно с питомцами"}}, extraInfo: "1000 ₽ в сутки", isAvailable: true},
        {amenity: {connect: {name: "Wi-Fi. Интернет"}}, extraInfo: "Бесплатный Wi-Fi", isAvailable: true},
        {amenity: {connect: {name: "Фен"}}, isAvailable: true},
        {amenity: {connect: {name: "Чайник"}}, isAvailable: true},
        {amenity: {connect: {name: "Обогреватели"}}, isAvailable: true},
        {amenity: {connect: {name: "Душ"}}, isAvailable: true},
        {amenity: {connect: {name: "Полотенца"}}, isAvailable: true},
        {amenity: {connect: {name: "Раковина"}}, isAvailable: true},
        {amenity: {connect: {name: "Водонагреватель"}}, isAvailable: true},
        {amenity: {connect: {name: "Туалетные средства/зубные принадлежности"}}, isAvailable: true},
        {amenity: {connect: {name: "Туалет (совмещенный)"}}, isAvailable: true},
        {amenity: {connect: {name: "Унитаз"}}, isAvailable: true},
        {amenity: {connect: {name: "Панорамные окна"}}, isAvailable: true},
        {amenity: {connect: {name: "Частный двор"}}, isAvailable: true},
        {amenity: {connect: {name: "Вид во двор"}}, isAvailable: true},
        {amenity: {connect: {name: "1 односпальная кровать"}}, isAvailable: true},
        {amenity: {connect: {name: "1 двуспальная кровать"}}, isAvailable: true},
    ]
}

function createHousesData(): Prisma.HouseCreateInput[] {
    return [
        {
            title: "Дом 1 (2+1)",
            subtitle: "",
            capacity: 3,
            area: 18,
            rooms: 1,
            price: 2500,
            petFee: 1000,
            maxPets: 1,
            smokingAllowed: false,
            amenities: {
                create: [
                    ...getBaseAmenities()
                ]
            }
        },
        {
            title: "Дом 2 (2+1+1)",
            subtitle: "",
            capacity: 4,
            area: 25,
            rooms: 1,
            price: 3200,
            petFee: 1000,
            maxPets: 2,
            smokingAllowed: false,
            amenities: {
                create: [
                    ...getBaseAmenities()
                ]
            }
        },
        {
            title: "Дом 3 (2+1+1)",
            subtitle: "",
            capacity: 4,
            area: 25,
            rooms: 1,
            price: 3200,
            petFee: 1000,
            maxPets: 2,
            smokingAllowed: false,
            amenities: {
                create: [
                    ...getBaseAmenities()
                ]
            }
        },
        {
            title: "Дом 4 (2+1+1)",
            subtitle: "",
            capacity: 4,
            area: 25,
            rooms: 1,
            price: 3200,
            petFee: 1000,
            maxPets: 2,
            smokingAllowed: false,
            amenities: {
                create: [
                    ...getBaseAmenities()
                ]
            }
        },
        {
            title: "Дом 5 (2+1+1)",
            subtitle: "",
            capacity: 4,
            area: 25,
            rooms: 1,
            price: 3200,
            petFee: 1000,
            maxPets: 2,
            smokingAllowed: false,
            amenities: {
                create: [
                    ...getBaseAmenities()
                ]
            }
        },
    ]
}

async function main() {
    try {
        // 1. Сначала создаем категории
        console.log('📁 Создаем категории...');
        for (const category of categories) {
            await prisma.amenityCategory.upsert({
                where: {name: category.name},
                update: category,
                create: category
            });
        }
        console.log('✅ Категории созданы');

        // 2. Получаем все категории для корректных categoryId
        const categoriesFromDb = await prisma.amenityCategory.findMany();
        const categoryMap = new Map(categoriesFromDb.map(c => [c.name, c.id]));

        // 3. Обновляем amenities с правильными categoryId
        const amenitiesWithCorrectIds = amenities.map(amenity => {
            const category = categories.find(c => c.id === amenity.categoryId);
            if (category) {
                return {
                    ...amenity,
                    categoryId: categoryMap.get(category.name)!
                };
            }
            return amenity;
        });

        // 4. Создаем удобства
        console.log('🔧 Создаем удобства...');
        for (const amenity of amenitiesWithCorrectIds) {
            await prisma.amenity.upsert({
                where: {name: amenity.name},
                update: amenity,
                create: amenity
            });
        }
        console.log('✅ Удобства созданы');

        // 5. Очищаем существующие дома
        console.log('🧹 Очищаем существующие дома...');
        await prisma.houseAmenity.deleteMany({});
        await prisma.photo.deleteMany({});
        await prisma.house.deleteMany({});
        console.log('✅ База очищена');

        // 6. Создаем дома со всеми удобствами
        console.log('🏠 Создаем дома...');
        const housesData = createHousesData();

        for (let i = 0; i < housesData.length; i++) {
            const houseData = housesData[i];
            await prisma.house.create({
                data: houseData
            });
            console.log(`  ✓ Дом ${i + 1} создан (${houseData.area}м², ${houseData.capacity} чел.)`);
        }
        console.log('✅ Все дома созданы');

        // 7. Проверяем результат
        const housesCount = await prisma.house.count();
        const amenitiesCount = await prisma.amenity.count();
        const houseAmenitiesCount = await prisma.houseAmenity.count();

        console.log('\n📊 Статистика:');
        console.log(`  • Домов: ${housesCount}`);
        console.log(`  • Удобств: ${amenitiesCount}`);
        console.log(`  • Связей дом-удобство: ${houseAmenitiesCount}`);
        console.log(`  • В среднем удобств на дом: ${(houseAmenitiesCount / housesCount).toFixed(1)}`);

        console.log('\n🎉 Сидирование успешно завершено!');

    } catch (error) {
        console.error('❌ Ошибка при сидировании:', error);
        throw error;
    }
}

main()
    .catch(async (e) => {
        console.error('❌ Критическая ошибка:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

