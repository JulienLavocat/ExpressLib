const jwt = require("jsonwebtoken");

const SERVICE_SECRET = process.env.jwtSecretKey;
const EXPIRE_IN = process.env.jwtExpiresIn;

function sign(payload) {
    return jwt.sign(payload, SERVICE_SECRET, {expiresIn: EXPIRE_IN});
}

function verify(token) {
    return jwt.verify(token, SERVICE_SECRET);
}

function refresh(token) {
    try {
        const data = verify(token);
        
        //Deleting expiration related claims
        delete data.exp;
        delete data.iat;

        return sign(data);

    } catch (error) {
        throw error;
    }
}

exports.sign = sign;
exports.verify = verify;
exports.refresh = refresh;