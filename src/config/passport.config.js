// tener instalado passport 
const passport = require('passport')
// tener instalado passport-github2 y passport-jwt
const GithubStrategy = require('passport-github2')
const jwt = require('passport-jwt')

// para acceder a la base de datos
const UserManagerMongo = require('../Daos/Mongo/usersDaoMongo')
const { configObject: {jwt_sign_key_secret, gh_callback_url, gh_client_id, gh_client_secret} } = require('./config')

const JWTStreategy = jwt.Strategy
const ExtractJWT   = jwt.ExtractJwt // es para sacar de las cookie
const userService = new UserManagerMongo()
// función que maneja la configuración de la estrategia de passport
const inizializePassport = ( ) => {

    const cookieExtractor = req => {
        let token = null
        if (req && req.cookies) {
            // console.log(req.cookies)
            token = req.cookies['cookieToken']
        }
        return token
    }

    // const objectStrategyJwt = {
    //     jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    //     secretOrKey: 'SecretKeyqueFuncionaParaFirmarElToken'
    // }
    // en jwt_payload está el token
    passport.use('jwt', new JWTStreategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: jwt_sign_key_secret
    }, async (jwt_payload, done)=>{
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    // middleware/estrategia
    // tener cuenta de github - configuración de desarrollo
    passport.use('github', new GithubStrategy({
        clientID: gh_client_id,
        clientSecret: gh_client_secret,
        callbackURL: gh_callback_url
    }, async (accessToken, refreshToken, profile, done)=> {
        // console.log('profile: ', profile)
        try {
            // validamos si existe el usuario
            let user = await userService.getUser({email: profile._json.email})
            
            if (!user) {
                let newUser = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: profile._json.email,
                    password: ''
                }

                let result = await userService.crateUsers(newUser)
                return done(null, result)
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }) )


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done)=>{
        let user = await userService.getUser({_id: id})
        done(null, user)
    })

}

module.exports = inizializePassport