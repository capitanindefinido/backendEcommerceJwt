const { userService } = require("../service/service.js")

const UserDto = require('../Dto/users.dto.js')
const { createError } = require("../utils/errors/CustomError.js")
const { generateUserErrorInfo } = require("../utils/errors/info.js")
const { EErrors } = require("../utils/errors/enums.js")


class UserController {
    constructor(){
        this.userService = userService
    }

    getUsers = async (req,res)=>{
        try {            
            let users = await this.usersService.getUsers()          
            res.send({status: 'success', payload: users})            
        } catch (error) {
            console.log(error)
        }
    }

    createUser = async (req,res, next) => {
        try {                  
            let {nombre, last_name, email} = req.body            
            if (!nombre || !last_name || !email ) {
                // return res.send({status: 'error', error: 'incomplete values'})
                createError({
                    name: 'User creation error',
                    cause: generateUserErrorInfo({nombre, last_name, email}),
                    message: 'Error tyring to crearted user',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }   
                
            // console.log(newUser)
            // let result = await this.usersService.createUser()
          
            res.send({status: 'success', payload: 'result'})
        } catch (error) {
            next(error)
        }
    
    }

    updateUser = async (req, res)=>{
        try {
            let {uid} = req.params
            let userToReplace = req.body
            if (!userToReplace.first_name || !userToReplace.last_name || !userToReplace.email ) return res.send({status: 'error', error: 'incomplete values'})        
            let result = await this.usersService.update({uid, userToUpdate})
            res.send({status: 'success', payload: result})
        } catch (error) {
            console.log(error)
        }
    }

    deleteUser = async (req, res)=>{
        try {
            let {uid} = req.params          
            let result = await this.usersService.delete(uid)
            res.send({status: 'success', payload: result})
        } catch (error) {
            console.log(error)
        }
    }
    async premiumUser(req,res){
        const {uid} =req.params
        const result =  await this.userService.updateUser({_id: uid}, {
            role: 'user-premium'
        })
        
        
        res.send('usuario paso a premium')
    }
}

module.exports = new UserController()