const jwt = require('jsonwebtoken')
const { configObject: {jwt_sign_key_secret} } = require('../config/config')


// asdñf jasdlkfsadljfkasldñfjlñasdjfñlasdjfñlasdflñasjdfasd

// crea el token
const generateToken = (user) => {
    return jwt.sign(user, jwt_sign_key_secret, { expiresIn: '24h' })     
}

// opera a nivel middleware
const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] /// authorization: BEARER lkahjsdfkhsdafkjsahdfkhsadkfhashkfahsfkhsdak
    // conso
    if (!authHeader) {
        return res.status(401).json({status: 'error', error: 'Not Autenticated'})
    }
    // token= [ 'BEARER', 'lkahjsdfkhsdafkjsahdfkhsadkfhashkfahsfkhsdak']
    const token = authHeader.split(' ')[1]

    jwt.verify(token, jwt_sign_key_secret, (error, credential)=>{
        if (error) {
            return res.status(403).json({status: 'error', error: 'NOT Authorizated'})
        }

        req.user = credential.user
        next()
    })
}

module.exports = {
    generateToken,
    authToken
}