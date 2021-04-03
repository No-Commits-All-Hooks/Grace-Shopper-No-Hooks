require('dotenv').config();

const { createProducts } = require('../db');

const { rebuildDB } = require('../db/seed.js');
const client = require('../db/client.js');

describe('Database', () => {
    let testProduct;
    describe('createProducts', () => {
        beforeAll(async() => {
            testProduct = await createProducts({
                name: 'Laptop Bag',
                description: `Laptop Bag for 17" Laptops`,
                price: 15,
                imageURL: 'https://d1vo2ulxpswjig.cloudfront.net/CAT4IMAGES/FRONT_MODEL/600/BG203_black_front.jpg',
                inStock: true,
                category: 'Bags'
            });
        })
        
        it('returns an object', async () => {
            expect(typeof testProduct).toBe('object');
        });
        it('returns an object containing id, name, description, price, imageURL, inStock, category', async () => {
            expect(testProduct).toEqual(expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(Number),
                imageURL: expect.any(String),
                inStock: expect.any(Boolean),
                category: expect.any(String),
            }));
        });
    });
});