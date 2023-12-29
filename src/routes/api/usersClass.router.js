const UserDaoMongo = require('../../Daos/Mongo/usersDaoMongo.js')
const Router = require('./router.js')

const userService = new UserDaoMongo()

class UsersRouter extends Router {
    init(){
        this.get('/', ['ADMIN'],async (req, res)=>{
            try {
                const users = await userService.getUsers()
                res.sendSuccess(users)                
            } catch (error) {
                console.log(error)
            }
        })
        this.post('/', ['ADMIN'], async (req, res)=> {
            try {        
                // let newUser = req.body
                let {first_name, last_name, email} = req.body
                
                if (!first_name || !last_name || !email ) return res.send({status: 'error', error: 'incomplete values'})
            
                let result = await userService.create({
                    first_name,
                    last_name,
                    email
                })
                // result
                res.send({status: 'success', payload: result})
            } catch (error) {
                console.log(error)
            }            
        })

        this.put('/:id', ['ADMIN'], async (req, res)=>{
            try {
                let {uid} = req.params
                let userToReplace = req.body
                if (!userToReplace.first_name || !userToReplace.last_name || !userToReplace.email ) return res.send({status: 'error', error: 'incomplete values'})
                let result = await userService.updateUsers({_id: uid}, userToReplace)
                res.send({status: 'success', payload: result})
            } catch (error) {
                console.log(error)
            }
        })

        this.delete('/:id', ['ADMIN'], async (req, res)=>{
            try {
                let {uid} = req.params
                let result = await userService.deleteUsers({_id: uid})
                res.send({status: 'success', payload: result})
            } catch (error) {
                console.log(error)
            }
        })
    }
}

module.exports = UsersRouter