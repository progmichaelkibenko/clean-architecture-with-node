const mongoose = require('mongoose');

const {
    Schema
} = mongoose;

module.exports = new Schema({
    name: String,
    description: String,
    images: Array(String),
    price: Number,
    color: String,
    meta: Object,
    deletedAt: Date,
    updatedAt: Date,
})