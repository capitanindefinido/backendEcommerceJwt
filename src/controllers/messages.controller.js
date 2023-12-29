const MessageDaoMongo = require("../Daos/Mongo/messagesDaosMongo")
const { messageService } = require("../service/service")

// controller/negocio messages
class MessageController {
    getMessages =  async (req, res)=>{
        try {
            const messages = await messageService.getMessages()
            res.send({message: messages})            
        } catch (error) {
            console.log(error)
        }
    }

    createMessage = async (req, res)=>{
        try {
            const result = await messageService.createMessages()
            res.send({message: result})            
        } catch (error) {
            console.log(error)
        }
    }

    updateMessage = async (req, res)=>{
        try {
            const result = await messageService.updateMessages()
            res.send({message: result})            
        } catch (error) {
            console.log(error)
        }
    }

    deleteMessage = async (req, res)=>{
        try {
            const result = await messageService.deleteMessages()
            res.send({message: result})            
        } catch (error) {
            console.log(error)
        }
    }

}



module.exports = MessageController