const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
    return token
}

const isTokenValid = ({ token }) => {
    
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
}

const userInfo = ({ token }) => {
    
    let decoded = jwt.decode(token);
    return decoded
}



module.exports = {
    createJWT,
    isTokenValid,
    userInfo
};
