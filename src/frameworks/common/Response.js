module.exports.Response = class Response {
    constructor({
        status = false,
        error = null,
        content = null
    }) {
        this.status = status;
        this.error = error;
        this.content = content;
    }
}

module.exports.ResponseError = class ResponseError {
    constructor({
        status,
        msg,
        reason,
        url,
        ip,
        validationErrors = []
    }) {
        this.status = status;
        this.msg = msg;
        this.reason = reason;
        this.url = url;
        this.ip = ip;
        this.validationErrors = validationErrors;
    }
}

module.exports.ValidationError = class ValidationError {
    constructor({
        field,
        msg
    }) {
        this.field = field;
        this.msg = msg;
    }
}
