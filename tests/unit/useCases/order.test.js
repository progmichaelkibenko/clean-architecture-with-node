const {
    v4: uuidv4
} = require('uuid');

const Chance = require('chance');

const chance = new Chance();

const {
    constants: {
        userConstants: {
            genders
        }
    }
} = require('../../../src/entities');

const {
    cloneDeep,
} = require('lodash');

const {
    usersRepository,
    productsRepository
} = require('../../../src/frameworks/repositories/inMemory');

const {
    order: {
        addOrderUseCase,
        getOrderByIdUseCase,
        updateOrderUseCase,
        deleteOrderUseCase
    },
    user: {
        getUserByIdUseCase,
        addUserUseCase
    },
    product: {
        getProductByIdUseCase,
        addProductUseCase
    }
} = require('../../../src/useCases');
const { ValidationError } = require('../../../src/frameworks/common');

describe('Order use cases', () => {
    let testOrder;

    const mockOrdersRepo = {
        add: jest.fn(async order => ({
            ...order,
            id: uuidv4()
        })),
        getById: jest.fn(async id => ({
            id,
            userId: uuidv4(),
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: false,
            meta: {
                comment: 'Please deliver it to me as soon as possible'
            }
        })),
        update: jest.fn(async order => order),
        delete: jest.fn(async order => order)
    }

    const dependencies = {
        ordersRepository: mockOrdersRepo,
        usersRepository,
        productsRepository,
        useCases: {
            user: {
                getUserByIdUseCase: jest.fn(dependencies => getUserByIdUseCase(dependencies))
            },
            product: {
                getProductByIdUseCase: jest.fn(dependencies => getProductByIdUseCase(dependencies))
            }
        }
    }

    const mocks = {};
    beforeAll(async () => {
        const addProduct = addProductUseCase(dependencies).execute;
        const addUser = addUserUseCase(dependencies).execute;

        mocks.products = await Promise.all([1, 2, 3].map(() => addProduct({
            name: chance.name(),
            description: chance.sentence(),
            images: [chance.url(), chance.url()],
            price: chance.natural(),
            color: chance.color(),
            meta: {
                review: chance.sentence()
            }
        })))

        mocks.users = await Promise.all([1, 2, 3].map(() => addUser({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.NOT_SPECIFIED,
            meta: {
                hair: {
                    color: chance.color()
                }
            }
        })))

        testOrder = {
            userId: mocks.users[0].id,
            productsIds: mocks.products.map(product => product.id),
            date: chance.date(),
            isPayed: false,
            meta: {
                comment: 'Please deliver it to me as soon as possible, if not i will kill you'
            }
        };
    })

    describe('Add order use case', () => {
        test('Order should be added', async () => {
            // call add order
            const addedOrder = await addOrderUseCase(dependencies).execute(
                testOrder
            )

            // check the result
            expect(addedOrder).toBeDefined()
            expect(addedOrder.id).toBeDefined();
            expect(addedOrder.userId).toBe(testOrder.userId);
            expect(addedOrder.productsIds).toEqual(testOrder.productsIds);
            expect(addedOrder.date).toEqual(testOrder.date);
            expect(addedOrder.isPayed).toBe(testOrder.isPayed);
            expect(addedOrder.meta).toEqual(testOrder.meta);

            // check the call
            const expectedOrder = mockOrdersRepo.add.mock.calls[0][0];
            expect(expectedOrder).toEqual(testOrder);
        });

        test('should return validation error when product id unknown', async () => {
            const fakeId = uuidv4();
            try {
                // call add order
                await addOrderUseCase(dependencies).execute({
                    ...testOrder,
                    productsIds: [...testOrder.productsIds, fakeId]
                })
                expect(true).toBe(false);
            } catch (err) {
                expect(err.status).toBe(403);
                expect(err.validationErrors).toEqual([new ValidationError({field: 'productsIds', msg: `No products with ids ${fakeId}`})])
            }
        })

        test('should return validation error when user id unknown', async () => {
            const fakeId = uuidv4();
            try {
                // call add order
                await addOrderUseCase(dependencies).execute({
                    ...testOrder,
                    userId: fakeId
                })
                expect(true).toBe(false);
            } catch (err) {
                expect(err.status).toBe(403);
                expect(err.validationErrors).toEqual([new ValidationError({field: 'userId', msg: `No user with id ${fakeId}`})])
            }
        })

    })

    describe('Get by id order use case', () => {
        test('Order should be returned by id', async () => {
            // add a fake id
            const fakeId = uuidv4();

            // call get order by id
            const returnedOrder = await getOrderByIdUseCase(dependencies).execute({
                id: fakeId
            })

            // check the received data
            expect(returnedOrder).toBeDefined();
            expect(returnedOrder.id).toBeDefined();
            expect(returnedOrder.userId).toBeDefined();
            expect(returnedOrder.productsIds).toBeDefined();
            expect(returnedOrder.date).toBeDefined();
            expect(returnedOrder.isPayed).toBeDefined();
            expect(returnedOrder.meta).toBeDefined();

            // check the mock call
            const expectedId = mockOrdersRepo.getById.mock.calls[0][0];
            expect(expectedId).toBe(fakeId);
        });
    })

    describe('Update order use case', () => {
        test('Order should be updated', async () => {
            // init an order with id
            const mockOrder = {
                ...testOrder,
                id: uuidv4
            }

            // call update
            const updatedOrder = await updateOrderUseCase(dependencies).execute({
                order: cloneDeep(mockOrder)
            })

            // check the data
            expect(updatedOrder).toEqual(mockOrder);

            // check the call
            const expectedOrder = mockOrdersRepo.update.mock.calls[0][0];
            expect(expectedOrder).toEqual(mockOrder)
        })
    })

    describe('Delete order use case', () => {
        test('Order should be deleted', async () => {
            // init an order with id
            const mockOrder = {
                ...testOrder,
                id: uuidv4
            }

            // call delete
            const deletedOrder = await deleteOrderUseCase(dependencies).execute({
                order: cloneDeep(mockOrder)
            })
            // check the data
            expect(deletedOrder).toEqual(mockOrder);

            // check the call
            const expectedOrder = mockOrdersRepo.delete.mock.calls[0][0];
            expect(expectedOrder).toEqual(mockOrder);
        });
    })
});