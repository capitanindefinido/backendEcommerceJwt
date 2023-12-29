const passport = require('passport')

exports.passportCall = strategy => {
    return async (req, res, next )=>{ // middleware
        passport.authenticate(strategy, function(err, user, info){
            // console.log('user pass call: ', user)
            if (err) return next(err)
            // preguntando si vien el usuario
        // console.log('user: ', user)
            if (!user) {
                
                // return res.status(401).send({error: info.messagge ? info.messagge : info.toString()})
                return res.status(401).render('error',{
                    showNav: true,
                    error: info.messagge ? info.messagge : info.toString()
                })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}