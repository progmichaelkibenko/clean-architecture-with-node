const {
    Response
} = require('../../frameworks/common');

module.exports = dependencies => {
    const {
        useCases: {
            product: {
                getProductByIdUseCase
            }
        }
    } = dependencies;

    return async (req, res, next) => {
        try {
            const {
                params = {}
            } = req;
            const {
                id
            } = params;

            const getProductId = getProductByIdUseCase(dependencies);
            const response = await getProductId.execute({
                id
            })

            res.json(new Response({
                status: true,
                content: response
            }))

            next();
        } catch (err) {
            next(err);
        }
    }
}