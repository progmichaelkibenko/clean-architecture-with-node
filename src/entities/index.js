const {
    User,
    userConstants
} = require('./User');

const {
    Product
} = require('./Product');

const {
    Order
} = require('./Order');

module.exports = {
    User,
    Product,
    Order,
    constants: {
        userConstants
    }
}