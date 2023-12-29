const { userModel } = require("../../models/user.model");
const { isValidPasword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jsonwebtoken");
const RouterClass = require("./router");

class SessionsRouter extends RouterClass {
    init(){
        this.postSessions('/login', ['PUBLIC'], async (req, res)=>{
            try {
                const { email, password } = req.body
   
                // validar que venga email y password

                // buscar el usuario 
                const user = await userModel.findOne({email})
                console.log(user)
                if (!user) return res.status(401).send({status: 'error', error: 'Usuario no existe'})

                if (!isValidPasword(password, user)) {
                    return res.status(401).send({status: 'error', error: 'Contraseña incorrecta'})
                }

                const token = generateToken({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: 'admin'
                })
                // dos formas de enviar el token
                res.cookie('cookieToken', token, {
                    maxAge: 60*60*1000,
                    httpOnly: true
                }).status(200).send({
                    status: 'success',
                    token: token, // ruta avanzada
                    message: 'loggen successfully'
                })
            } catch (error) {
                console.log(error)
            }
        })

        this.postSessions('/register', ['PUBLIC'], async (req, res)=>{
            try {
                const { first_name, last_name, email, password } = req.body
                // validar campos
                if (!first_name) {
                    return res.send({status: 'error', error: 'completar todos los campos'})
                }
                const exists = await userModel.findOne({email})
        
                if (exists) return res.status(401).send({status: 'error', error: 'El usuario con el mail ingresado ya existe'})
        
                const newUser = {
                    first_name,
                    last_name,
                    email, 
                    password: createHash(password)
                }
        
                let result = await userModel.create(newUser)
                // validar result
        
                res.send({status: 'success', message: 'El ususario fue creado correctamente'})
            } catch (error) {
                console.log(error)
            }
        })

    }
}

module.exports = SessionsRouter