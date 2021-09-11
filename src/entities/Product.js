module.exports.Product = class Product {
    constructor({
        id,
        name = null,
        description = null,
        images = [],
        price = null,
        color = null,
        meta = {}
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.images = images;
        this.price = price;
        this.color = color;
        this.meta = meta;
    }
}