
const { UserDao, MessageDao, ProductDao } = require("../Daos/factory.js")

const UserRerpository = require("../repositories/users.repository.js")
const MessageRepository = require("../repositories/message.repository.js")
const ProductRepository = require("../repositories/products.repository.js")


const userService     = new UserRerpository(new UserDao())
const messageService  = new MessageRepository(new MessageDao())
const productService  = new ProductRepository(new ProductDao())

module.exports = {
    userService,
    messageService,
    productService
}


