const generateUserErrorInfo = (user) => {
    console.log(user)
    return `
        One or more properties were incomplete or not valid.
        List of require properties:
        * first_name: nedds to be a sting, recived ${user.nombre}    
        * lastrst_name: nedds to be a sting, recived ${user.last_name}    
        * email: nedds to be a sting, recived ${user.email}    
    `
}

module.exports = {
    generateUserErrorInfo
}