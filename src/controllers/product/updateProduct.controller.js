const {
    Response
} = require('../../frameworks/common');

module.exports = dependencies => {
    const {
        useCases: {
            product: {
                updateProductUseCase
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
                name,
                description,
                images,
                price,
                color,
                meta
            } = body

            const updateProduct = updateProductUseCase(dependencies);
            const response = await updateProduct.execute({
                product: {
                    id,
                    name,
                    description,
                    images,
                    price,
                    color,
                    meta
                }
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