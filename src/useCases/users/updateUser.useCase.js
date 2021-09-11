module.exports = dependencies => {

    const {
        usersRepository
    } = dependencies;

    if (!usersRepository) {
        throw new Error('The users repository should be exist in dependencies');
    }

    const execute = ({
        user = {}
    }) => {
        return usersRepository.update(user);
    }

    return {
        execute
    }
}