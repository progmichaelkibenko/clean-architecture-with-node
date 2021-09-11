module.exports.User = class User {
    constructor({
        id,
        name = null,
        lastName = null,
        gender = genders.NOT_SPECIFIED,
        meta = {}
    }) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.gender = gender;
        this.meta = meta;
    }
}

const genders = {
    NOT_SPECIFIED: 0,
    FEMALE: 1,
    MALE: 2
}

module.exports.userConstants = {
    genders
}