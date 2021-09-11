const express = require('express');
const usersRouter = require('./users');
const productsRouter = require('./products');
const ordersRouter = require('./order');

module.exports = dependencies => {
    const routes = express.Router();

    const users = usersRouter(dependencies);
    const products = productsRouter(dependencies);
    const orders = ordersRouter(dependencies);

    routes.use('/users', users);
    routes.use('/products', products);
    routes.use('/orders', orders);

    return routes;
}