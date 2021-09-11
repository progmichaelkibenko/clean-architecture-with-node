const {
    isEmpty
} = require('lodash');

const {
    ValidationError
} = require('../../frameworks/common');

module.exports = dependencies => {
    const {
        useCases: {
            user: {
                getUserByIdUseCase
            },
            product: {
                getProductByIdUseCase
            }
        }
    } = dependencies;

    if (!getUserByIdUseCase) {
        throw new Error('getUserByIdUseCase should be exist in dependencies')
    }

    if (!getProductByIdUseCase) {
        throw new Error('getUserByIdUseCase should be exist in dependencies')
    }

    const getUserById = getUserByIdUseCase(dependencies).execute;
    const getProductById = getProductByIdUseCase(dependencies).execute;

    return async ({
        order = {}
    }) => {
        const returnable = [];

        const {
            productsIds = [],
                userId
        } = order;

        const products = await Promise.all(productsIds.map(id => getProductById({
            id
        })))

        const notFoundIds = products.reduce((acc, product, i) => {
            if (!product) {
                acc.push(productsIds[i]);
            }
            return acc;
        }, []);

        if (!isEmpty(notFoundIds)) {
            returnable.push(new ValidationError({
                field: 'productsIds',
                msg: `No products with ids ${notFoundIds.join(', ')}`
            }))
        }

        const user = await getUserById({
            id: userId
        });
        if (!user) {
            returnable.push(new ValidationError({
                field: 'userId',
                msg: `No user with id ${userId}`
            }))
        }

        return returnable;
    }
}
