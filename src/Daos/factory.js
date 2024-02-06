const { configObject: {persistence, conectDB} } = require('../config/config.js')

let MessageDao
let UserDao
let ProductDao
let TicketDao

switch (persistence) {
    case "MONGO":
        conectDB()
        const MessageDaoMongo = require('./Mongo/messagesDaosMongo.js') 
        MessageDao = MessageDaoMongo
        
        const UserDaoMongo    = require('./Mongo/usersDaoMongo.js')
        UserDao    = UserDaoMongo

        const ProductDaoMongo = require('./Mongo/productsDaoMongo.js')
        ProductDao = ProductDaoMongo

        const TicketDaoMongo = require('./Mongo/ticketsDaoMongo.js')
        TicketDao = TicketDaoMongo
        break;
    
    case "MEMORY":
        
        break;
    case "FILE":
        const MessageDaoFile = require('./File/messagesDaoFile.js')
        MessageDao = MessageDaoFile
        break;

    default:
        break;
}

module.exports = {
    UserDaoMongo,
    MessageDaoMongo,
    ProductDaoMongo,
    TicketDaoMongo
}