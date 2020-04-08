const jwt = require('jsonwebtoken');

const jwt_secret = 'c19cf0ee354dee5163bf6b19f0a52cca1892ee15aa5acddd4df33d6a48d62075';

exports.generateToken = (user) => {
    //genere un token
    return jwt.sign(
        { userId: user.id, 
            isAdmin: user.isAdmin },
        jwt_secret,
        { expiresIn: '20m' }
    );
}

exports.parseAuthorization = (authorization) => {
    return (authorization !== null) ? authorization.replace('Bearer ', '') : null;
}

exports.getUserId = (authorization) => {
    let userId = -1;
    var token = this.parseAuthorization(authorization);
    if (token != null) {
        try {
            var jwtToken = jwt.verify(token, jwt_secret);
            if (jwtToken != null) {
                userId = jwtToken.userId;
            }
        } catch (error) {
            //
        }
    }
    return userId;
}

