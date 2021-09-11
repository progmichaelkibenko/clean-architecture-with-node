const {
    Product
} = require('../../../src/entities');

const Chance = require('chance');

const chance = new Chance();

const {
    cloneDeep
} = require('lodash');

const {
    v4: uuidv4
} = require('uuid');

const {
    product: {
        addProductUseCase,
        getProductByIdUseCase,
        updateProductUseCase,
        deleteProductUseCase
    }
} = require('../../../src/useCases');

describe('Products use cases', () => {

    const testProduct = new Product({
        name: chance.name(),
        description: chance.sentence(),
        images: [uuidv4(), uuidv4()],
        price: chance.natural(),
        color: chance.color(),
        meta: {
            comment: 'the best product for this year'
        }
    })

    const mockProductRepo = {
        add: jest.fn(async product => ({
            ...product,
            id: uuidv4()
        })),
        getById: jest.fn(async id => ({
            id,
            name: chance.name(),
            description: chance.sentence(),
            images: [uuidv4(), uuidv4()],
            price: chance.natural(),
            color: chance.color(),
            meta: {
                comment: 'The best product of the millenium'
            }
        })),
        update: jest.fn(async product => product),
        delete: jest.fn(async product => product)
    }

    const dependencies = {
        productsRepository: mockProductRepo
    }
    describe('Add product use case', () => {
        test('New product should be added', async () => {
            // call save product
            const savedProduct = await addProductUseCase(dependencies).execute(testProduct);

            // check the result
            expect(savedProduct).toBeDefined();
            expect(savedProduct.id).toBeDefined();
            expect(savedProduct.name).toBe(testProduct.name);
            expect(savedProduct.description).toBe(testProduct.description);
            expect(savedProduct.images).toEqual(testProduct.images);
            expect(savedProduct.price).toBe(testProduct.price);
            expect(savedProduct.color).toBe(testProduct.color);
            expect(savedProduct.meta).toEqual(testProduct.meta);


            // check the call
            const expectedUserData = mockProductRepo.add.mock.calls[0][0];
            expect(expectedUserData).toEqual(testProduct);
        });
    })

    describe('Get product by id use case', () => {
        test('Product should be returned', async () => {
            // create a fake id and call get by id use case
            const fakeId = uuidv4();
            const returnedProduct = await getProductByIdUseCase(dependencies).execute({
                id: fakeId
            })

            // check that the data returned as expected
            expect(returnedProduct).toBeDefined();
            expect(returnedProduct.id).toBeDefined();
            expect(returnedProduct.name).toBeDefined();
            expect(returnedProduct.description).toBeDefined();
            expect(returnedProduct.images).toBeDefined();
            expect(returnedProduct.price).toBeDefined();
            expect(returnedProduct.color).toBeDefined();
            expect(returnedProduct.meta).toBeDefined();

            // check the mock call
            const expectedId = mockProductRepo.getById.mock.calls[0][0];
            expect(expectedId).toBe(fakeId);
        });
    })

    describe('Update product use case', () => {
        test('Product should be updated', async () => {
            const mockProduct = {
                ...testProduct,
                id: uuidv4()
            };
            // call update
            const updatedProduct = await updateProductUseCase(dependencies).execute({
                product: cloneDeep(mockProduct)
            })

            // check the returned data
            expect(updatedProduct).toEqual(mockProduct);

            // check the call
            const expectedProduct = mockProductRepo.update.mock.calls[0][0];
            expect(expectedProduct).toEqual(mockProduct);
        });
    })

    describe('Delete product use case', () => {
        test('Product should be deleted', async () => {
            // create a product with id
            const mockProduct = {
                ...testProduct,
                id: uuidv4()
            };

            // call delete product use case
            const deletedProduct = await deleteProductUseCase(dependencies).execute({
                product: cloneDeep(mockProduct)
            });

            // check the returned data
            expect(deletedProduct).toEqual(mockProduct);

            // check the mock call
            const expectedProduct = mockProductRepo.delete.mock.calls[0][0];
            expect(expectedProduct).toEqual(mockProduct);
        });
    })
})