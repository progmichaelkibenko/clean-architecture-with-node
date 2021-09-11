const {
    User
} = require('../../entities');

module.exports = dependencies => {

    const {
        usersRepository
    } = dependencies;
    if (!usersRepository) {
        throw new Error('The users repository should be exist in dependencies');
    }

    const execute = ({
        name,
        lastName,
        gender,
        meta
    }) => {
        const user = new User({
            name,
            lastName,
            gender,
            meta
        })

        return usersRepository.add(user);
    }

    return {
        execute
    }
}