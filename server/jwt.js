const { sign, verify } = require('jsonwebtoken');

const createToken = (user) => {
    const accessToken = sign({ username: user.username, id: user.id }, "notSoSecret" );
    return accessToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
    if (!accessToken) {
        res.status(401).json({loggedIn: false, error: "No token provided"})
    } else {
        try {
            const isValid = verify(accessToken, "notSoSecret");
            if (isValid) {
                req.validated = true;
                return next();
            }
        } catch (err) {
            return res.status(400).json({loggedIn: false, error: err});
        }
    }   
}
module.exports = { createToken, validateToken };