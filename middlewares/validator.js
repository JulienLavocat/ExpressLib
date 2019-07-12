const Validator = require("express-json-validator-middleware").Validator;

const validate = new Validator().validate;

exports.body = function (schema) {
    return validate({body: schema});
}
exports.query = function (schema) {
    return validate({query: schema});
}
exports.properties = function (validationObject) {
    return validate(validationObject);
}