const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, 'mean_course_practise');
        next();
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) {
            console.log('Expiration Exception', req.headers);
        }
        res.status(401).json({
            message: `full authentication is required to access this resources`,
            error: error
        })
    }
};