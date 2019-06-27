const Validator = require("express-json-validator-middleware").Validator;

const validate = new Validator().validate;

module.exports = function (schema) {
    return validate({body: schema});
}