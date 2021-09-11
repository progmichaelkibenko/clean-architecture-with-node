const {
    Response
} = require('../../frameworks/common');

module.exports = dependencies => {
    const {
        useCases: {
            order: {
                addOrderUseCase
            }
        }
    } = dependencies;

    return async (req, res, next) => {
        try {
            const {
                body = {}
            } = req;

            const {
                userId,
                productsIds,
                date,
                isPayed,
                meta
            } = body;

            const addOrder = addOrderUseCase(dependencies);
            const response = await addOrder.execute({
                userId,
                productsIds,
                date,
                isPayed,
                meta
            });
            res.json(new Response({
                status: true,
                content: response
            }))

            next();
        } catch (e) {
            next(e);
        }
    }
}