const Chance = require('chance');

const {
    ordersRepository,
} = require('../../../src/frameworks/repositories/inMemory');

const {
    Order
} = require('../../../src/entities');

const chance = new Chance();

const {
    cloneDeep
} = require('lodash');

const {
    v4: uuidv4
} = require('uuid');

describe('Orders repository', () => {
    test('New Order should be added and returned', async () => {
        // add a new order
        const testOrder = new Order({
            userId: uuidv4(),
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: true,
            meta: {
                comment: 'Deliver it to me as soon as possible'
            }
        })

        const addedOrder = await ordersRepository.add(testOrder);
        // check the order
        expect(addedOrder).toBeDefined();
        expect(addedOrder.id).toBeDefined();
        expect(addedOrder.userId).toBe(testOrder.userId);
        expect(addedOrder.productsIds).toEqual(testOrder.productsIds);
        expect(addedOrder.date).toEqual(testOrder.date);
        expect(addedOrder.isPayed).toBe(testOrder.isPayed);
        expect(addedOrder.meta).toEqual(testOrder.meta);

        // get the order and check that it is equal
        const returnedOrder = await ordersRepository.getById(addedOrder.id);
        expect(returnedOrder).toEqual(addedOrder);
    })
    test('New Order should be deleted', async () => {
        // add two orders
        const willBeDeletedOrder = new Order({
            userId: uuidv4(),
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: true,
            meta: {
                comment: 'Deliver it to me as soon as possible'
            }
        })

        const shouldStayOrder = new Order({
            userId: uuidv4(),
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: true,
            meta: {
                comment: 'Deliver it to me as soon as possible'
            }
        })

        const [willBeDeletedAddedOrder, shouldStayAddedOrder] = await Promise.all([ordersRepository.add(willBeDeletedOrder), ordersRepository.add(shouldStayOrder)])
        expect(willBeDeletedAddedOrder).toBeDefined();
        expect(shouldStayAddedOrder).toBeDefined();

        // delete one order
        const deletedOrder = await ordersRepository.delete(willBeDeletedAddedOrder);
        expect(deletedOrder).toEqual(willBeDeletedAddedOrder);

        // try to get the deleted order and it should be undefined
        const shouldBeDeleyedOrder = await ordersRepository.getById(deletedOrder.id);
        expect(shouldBeDeleyedOrder).toBeUndefined()

        // check that just relevant order deleted
        const shouldBeDefinedOrder = await ordersRepository.getById(shouldStayAddedOrder.id);
        expect(shouldBeDefinedOrder).toBeDefined()
    })
    test('New Order should be updated', async () => {
        // add a new order
        const testOrder = new Order({
            userId: uuidv4(),
            productsIds: [uuidv4(), uuidv4()],
            date: chance.date(),
            isPayed: true,
            meta: {
                comment: 'Deliver it to me as soon as possible'
            }
        })

        const addedOrder = await ordersRepository.add(testOrder);
        expect(addedOrder).toBeDefined();

        // update an order (with cloning)
        const clonedOrder = cloneDeep({
            ...addedOrder,
            isPayed: false,
            productsIds: [...testOrder.productsIds, uuidv4()],
        })

        const updatedOrder = await ordersRepository.update(clonedOrder);
        // check the update
        expect(updatedOrder).toEqual(clonedOrder);
    })

});
