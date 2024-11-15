const jwt = require("jsonwebtoken");

const tokenSign = async (user)  => {
    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
            stores: user.stores
        },
        process.env.SECRET_KEY,
        {
            expiresIn: "2h",
        }
    );
}

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
        return null;
    }
}

module.exports = {tokenSign, verifyToken};