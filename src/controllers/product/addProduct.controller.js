const {
    Response
} = require('../../frameworks/common');

module.exports = dependencies => {
    const {
        useCases: {
            product: {
                addProductUseCase
            }
        }
    } = dependencies;

    return async (req, res, next) => {
        try {
            const {
                body = {}
            } = req;

            const {
                name,
                description,
                images,
                price,
                color,
                meta
            } = body

            const addProduct = addProductUseCase(dependencies);
            const response = await addProduct.execute({
                name,
                description,
                images,
                price,
                color,
                meta
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