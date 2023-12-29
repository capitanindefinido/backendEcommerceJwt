const { userModel } = require("../../models/user.model")
// persistencia/model
class UserDaoMongo {
    constructor(){
        this.model = userModel
    }    
    async get(){
        // return this.model.find({})
        return await userModel.paginate({}, {limit: 20, page: 2})
    }
    async getBy(filter){ // {_id: pid} - { email } 
        return this.model.findOne(filter)
    }
    async crate(newUser){
        return this.model.create(newUser)
    }
    async update({uid, userToUpdate}){
        return this.model.findByIdAndUpdate({_id: uid}, userToUpdate)
    }
    async delete(uid){
        return this.model.findByIdAndDelete({_id: uid})
    }
}

module.exports = UserDaoMongo