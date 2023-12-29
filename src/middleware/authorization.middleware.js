const { array } = require("zod")

exports.authorization = roleArray => {
    return async (req, res, next) => {
        try {
            // doble validación ya realizada en passportCall
            // if (!req.user) return res.status(401).json({status: 'error', error: 'Unauthorized'})
            if (!req.user) return res.status(401).render('error', { showNav: true, status: 'error', error: 'Unauthorized'})
            // Si role es un array de roles
            // if(req.user.role !== role) return res.status(403).render('error',{status: 'error', error: `Not permissions, only ${role}` })
            // if(!roleArray.includes(req.user.role.toUpperCase())) return res.status(403).send({status: 'error', error: 'Not permissions'})
            if(!roleArray.includes(req.user.role.toUpperCase())) return res.status(403).render('error',{ showNav: true,status: 'error', error: 'Not permissions'})
            next()
        } catch (error) {
            console.log(error)
        }
    }
}