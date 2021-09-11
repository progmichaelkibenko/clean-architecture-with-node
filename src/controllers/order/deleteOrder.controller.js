const {
    Response
} = require('../../frameworks/common');

module.exports = dependencies => {
    const {
        useCases: {
            order: {
                deleteOrderUseCase
            }
        }
    } = dependencies;

    return async (req, res, next) => {
        try {
            const {
                body = {}
            } = req;

            const {
                id,
                userId,
                productsIds,
                date,
                isPayed,
                meta
            } = body;
            const deleteOrder = deleteOrderUseCase(dependencies);
            const response = await deleteOrder.execute({
                order: {
                    id,
                    userId,
                    productsIds,
                    date,
                    isPayed,
                    meta
                }
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