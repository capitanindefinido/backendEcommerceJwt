const UserDto = require("../Dto/users.dto")

class UserRerpository {
    constructor(dao){
        this.dao = dao
    }

    async getUsers(){
        return await this.dao.get() 
    }
    async getUser(){
        return await this.dao.getBy()
    }
    async createUser(user){
        const newUser = new UserDto(user)
        return await this.dao.create(newUser)
    }
    async updateUser(){}
    async deleteUser(){}
}

module.exports = UserRerpository