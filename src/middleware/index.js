const { auth } = require("./authentication")
const { authorization } = require("./authorization.middleware")
const { passportCall } = require("./passportCall")

module.exports = {
    auth,
    authorization,
    passportCall
}