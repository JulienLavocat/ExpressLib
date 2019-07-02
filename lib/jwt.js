const jwt = require("jsonwebtoken");
const uuid = require("uuid/v4");

const SECRET_KEY = process.env.jwtSecretKey;
const EXPIRE_IN = process.env.jwtExpiresIn;

function sign(payload) {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: EXPIRE_IN,
        jwtid: uuid()
    });
}

function decode(token) {
    return jwt.decode(token);
}

function verify(token) {
    return jwt.verify(token, SECRET_KEY);
}

function refresh(token) {
    try {
        const data = verify(token);
        
        //Deleting expiration related claims
        delete data.exp;
        delete data.iat;
        delete data.jti;

        return sign(data);

    } catch (error) {
        throw error;
    }
}

exports.sign = sign;
exports.decode = decode;
exports.verify = verify;
exports.refresh = refresh;