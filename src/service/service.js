
const { UserDao, MessageDao, ProductDao, TicketDao } = require("../Daos/factory.js")

const UserRerpository = require("../repositories/users.repository.js")
const MessageRepository = require("../repositories/message.repository.js")
const ProductRepository = require("../repositories/products.repository.js")
const TicketRepository = require("../repositories/tickets.repository.js")


const userService     = new UserRerpository(UserDao)
const messageService  = new MessageRepository(MessageDao)
const productService  = new ProductRepository(ProductDao)
const ticketService = new TicketRepository(TicketDao)

module.exports = {
    userService,
    messageService,
    productService,
    ticketService
}


