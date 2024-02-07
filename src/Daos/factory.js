const { configObject: {persistence, conectDB} } = require('../config/config.js')

 

switch (persistence) {
    case "MONGO":
        conectDB()
        const MessageDaoMongo = require('./Mongo/messagesDaosMongo.js') 
        const MessageDao = MessageDaoMongo
        
        const UserDaoMongo = require('./Mongo/usersDaoMongo.js')
        const UserDao    = UserDaoMongo

        const ProductDaoMongo = require('./Mongo/productsDaoMongo.js')
        const ProductDao = ProductDaoMongo

        const TicketDaoMongo = require('./Mongo/ticketsDaoMongo.js')
        const TicketDao = TicketDaoMongo
        break;
    
    case "MEMORY":
        
        break;
    case "FILE":

        break;

    default:
        break;
}

module.exports = {
    MessageDao,
    UserDao,
    ProductDao,
    TicketDao
}