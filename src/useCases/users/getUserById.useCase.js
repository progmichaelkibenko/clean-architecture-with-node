module.exports = dependencies => {

    const {
        usersRepository
    } = dependencies;

    if (!usersRepository) {
        throw new Error('The users repository should be exist in dependencies');
    }

    const execute = ({
        id
    }) => {
        return usersRepository.getById(id);
    }

    return {
        execute
    }
}