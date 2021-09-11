const addUserController = require('./addUser.controller');
const getUserByIdController = require('./getUserById.controller');
const updateUserController = require('./updateUser.controller');
const deleteUserController = require('./deleteUser.controller');

module.exports = dependencies => {
    return {
        addUserController: addUserController(dependencies),
        getUserByIdController: getUserByIdController(dependencies),
        updateUserController: updateUserController(dependencies),
        deleteUserController: deleteUserController(dependencies)
    }
}