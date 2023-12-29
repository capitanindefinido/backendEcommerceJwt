const { Router } = require('express')
const jwt = require('jsonwebtoken')
const { passportCall } = require('../../middleware/passportCall')

class RouterClass {
    constructor(){
        this.router = Router()
        this.init()
    }

    getRouter(){
        return this.router
    }

    init(){}

    applyCallbacks(callbacks){
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error)
                params[1].status(500).send(error)
            }
        })        
    }

    generateCustomResponses(req, res, next){
        res.sendSuccess = payload => res.send({status: 'success', payload})
        res.sendServerError = error => res.status(500).send({status: 'error', error})
        res.sendUserError = (status, error) => res.status(status).send({status: 'error', error})
        next()
    }

    // verificiación de roles de usuario, policies -> ['public']
    handlePolicies = policies => (req, res, next)=>{
        if (policies[0]==='PUBLIC') return next()
        
        // con headers se hace así 
        // const authHeaders = req.headers.authorization        
        // if (!authHeaders) return res.sendUserError(401, 'Unauthorized')
        // const token = authHeaders.split(' ')[1]
        
        // con cookies no hace falta el header y se hace así
        const token = req.cookies.cookieToken       
        if (!token) return res.sendUserError(401, 'Unauthorized')
        
        let user = jwt.verify(token, 'SecretKeyqueFuncionaParaFirmarElToken')
        if(!policies.includes(user.role.toUpperCase())) return res.sendUserError(403, 'Not permissions')
        req.user = user
        next()
        // if (!authHeaders) return res.status(401).send({status: 'error', error: 'Unauthorized'})
        // if(!policies.includes(user.user.role.toUpperCase())) return res.status(403).send({status: 'error', error: 'Not permissions'})
    }

    get(path, policies, ...callbacks){ // callbacks=[passportCall('jwt'), authorization('user'), (req, res)=>{}]
        this.router.get(path, this.generateCustomResponses, passportCall('jwt'), this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }
    post(path, policies, ...callbacks){
        this.router.post(path, this.generateCustomResponses, passportCall('jwt'), this.handlePolicies(policies), this.applyCallbacks(callbacks))
        
    }
    postSessions(path, policies, ...callbacks){
        this.router.post(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks))
        
    }
    put(path, policies, ...callbacks){
        this.router.put(path, this.generateCustomResponses, passportCall('jwt'), this.handlePolicies(policies), this.applyCallbacks(callbacks))
        
    }
    delete(path, policies, ...callbacks){
        this.router.delete(path, this.generateCustomResponses, passportCall('jwt'), this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }
}

module.exports = RouterClass// (en la importación se va a llamar Router)
