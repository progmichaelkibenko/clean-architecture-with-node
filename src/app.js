require('dotenv').config()

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

const routes = require('./frameworks/expressSpecific/routes');

const API_PREFIX = process.env.API_PREFIX || '/api/v1';

const dependencies = require('./config/dependencies');

const ErrorHandler = require('./frameworks/expressSpecific/ErrorHandler');

const {
    connect: connectToMongo
} = require('./frameworks/database/mongo');

module.exports = {
    start: () => {
        // Midlewares
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }))

        // Routes
        app.use(API_PREFIX, routes(dependencies))

        // Common Error handler
        app.use(ErrorHandler);

        app.listen(PORT, () => {
            console.log(`WOHOOO our server is running under port ${PORT}`);
            connectToMongo();
        })
    }
}