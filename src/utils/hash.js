const bcrypt = require('bcrypt')

// encripta la contraseña
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//valida la contraseña
const isValidPasword = (password, user) => bcrypt.compareSync(password, user.password) 

module.exports = {
    createHash,
    isValidPasword
}