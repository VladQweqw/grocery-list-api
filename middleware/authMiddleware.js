const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    // const token = req.header('Authorization')
    next()

    // if(!token) {
    //     return res.status(401).json({ error: "Access denied"})
    // }

    // jwt.verify(token, 'monkey banana', (err, decoded) => {
    //     if(err) {
    //         next()

    //         // res.status(401).json({
    //         //     error: "Invalid token"
    //         // })
    //     }else {
    //         next()
    //     } 
    // });

}

module.exports = verifyToken