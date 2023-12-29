const { Router } = require('express')

const MessageController = require('../../controllers/messages.controller')

const router = Router()
const { 
    getMessages, 
    createMessage, 
    updateMessage,
    deleteMessage 
} = new MessageController()
 
router
    .get('/', getMessages)    
    .post('/', createMessage)
    .put('/:mid', updateMessage)
    .delete('/:mid', deleteMessage)

module.exports = router