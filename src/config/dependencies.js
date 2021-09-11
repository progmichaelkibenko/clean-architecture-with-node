const useCases = require('../useCases');
const repositories = require('../frameworks/repositories/mongo');
module.exports = {
    useCases,
    ...repositories
}