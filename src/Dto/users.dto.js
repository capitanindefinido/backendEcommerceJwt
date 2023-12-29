class UserDto {
    constructor(newUser){   
        this.full_name  = `${newUser.nombre} ${newUser.last_name}` 
        this.first_name = newUser.nombre
        this.last_name  = newUser.last_name
        this.isActive     = true
    }
}
module.exports =  UserDto 