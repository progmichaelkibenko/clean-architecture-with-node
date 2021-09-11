module.exports = dependencies => {
    const {
        productsRepository
    } = dependencies;

    if (!productsRepository) {
        throw new Error('productsRepository should be in dependencies');
    }

    const execute = ({
        id
    }) => {
        return productsRepository.getById(id);
    }

    return {
        execute
    }
}