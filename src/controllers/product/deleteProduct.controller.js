const {
    Response
} = require('../../frameworks/common');

module.exports = dependencies => {
    const {
        useCases: {
            product: {
                deleteProductUseCase
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

            const deleteProduct = deleteProductUseCase(dependencies);
            const response = await deleteProduct.execute({
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