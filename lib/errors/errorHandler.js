const HttpError = require("./HttpError");
const JsonError = require("express-json-validator-middleware").ValidationError;
const MongoError = require("mongodb").MongoError;
const JWTError = require("jsonwebtoken").JsonWebTokenError;
const NBFError = require("jsonwebtoken").NotBeforeError;
const TokenExpiredError = require("jsonwebtoken").TokenExpiredError;

const transformers = require("./transformers");

module.exports = (error, req, res, next) => {

    if (error instanceof JsonError)
        error = transformers.json(error);

    if (error instanceof MongoError)
        error = transformers.mongo(error);

    if (error instanceof JWTError)
        error = transformers.jwt(error);

    if (error instanceof NBFError)
        error = transformers.nbf(error);

    if (error instanceof TokenExpiredError)
        error = transformers.tokenExpired(error);

    if (error instanceof HttpError) {
        const status = error.httpStatus;
        const body = {
            success: false,
            error: error.toJSON()
        };
        return res.status(status).send(body);
    }

    console.error(error);
    return unknowError(res, new HttpError("internal", "An unknown error occured, please report it", error.message));
}

function unknowError(res, error) {
    const status = error.httpStatus;
    const body = {
        error: error.toJSON()
    };
    return res.status(status).send(body);
}