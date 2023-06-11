const jwt = require('jsonwebtoken');
const config = require('../config/secret');

exports.verification = function (req, rest, next) {
    var tokenWithBearer = req.headers.authorization;
    if (tokenWithBearer) {
        var token = tokenWithBearer.split(' ')[1];

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log(err);
                return rest.status(401).send({auth: false, message: "Token tidak terdaftar!"});
            } else {
                req.auth = decoded;
                next();
            }
        })
    } else {
        return rest.status(401).send({auth: false, message: "Token tidak tersedia!"});
    }
}