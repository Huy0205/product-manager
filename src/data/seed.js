import {faker} from '@faker-js/faker';
import db from '@/db/dexieDB';

let isSeeding = false;

const seedProducts = async () => {
    if (isSeeding) return;
    isSeeding = true;

    const products = Array.from({length: 1000}, () => ({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        quantity: faker.number.int({min: 1, max: 100}),
    }));

    await db.products.bulkPut(products);
    console.log('Database seeded with 1000 products');
    isSeeding = false;
};

export default seedProducts;
