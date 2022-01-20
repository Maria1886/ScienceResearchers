const jwt = require('jsonwebtoken')

function ensureAuthenticated(req, res, next) {
    // get access token if any
    const token = req.cookies['jwt'] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        // if no token then not authorized
        return res.sendStatus(401);
    }

    try {
        // extract jwt payload from token
        const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
        // attach extracted userId to the request
        req.userId = payload.userId;
        // move on the the next middleware/function
        return next();
    } catch (e) {
        return res.sendStatus(401);
    }
}

function ensureNotAuthenticated(req, res, next){
    // get access token if any
    const token = req.cookies['jwt'] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        // if no token then move on
        return next();
    }

    try {
        // try verify the token
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
        // if valid then not authorized
        return res.sendStatus(401);
    } catch (e) {
        // if not valid then move on
        return next();
    }
}

module.exports = { ensureAuthenticated, ensureNotAuthenticated }