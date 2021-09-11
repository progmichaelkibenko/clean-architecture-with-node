const {
    Response
} = require('../../frameworks/common');

module.exports = dependencies => {

    const {
        useCases: {
            user: {
                getUserByIdUseCase
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

            const getUserById = getUserByIdUseCase(dependencies);
            const response = await getUserById.execute({
                id
            })

            res.json(new Response({
                status: true,
                content: response
            }))

            next();

        } catch (err) {
            next(err)
        }
    };
}