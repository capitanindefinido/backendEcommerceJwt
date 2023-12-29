class MessageRepository {
    constructor(dao){
        this.dao = dao
    }
    async getMessages(){}
    async getMessage(){}
    async createMessage(){}
    async updateMessage(){}
    async deleteMessage(){}
}

module.exports = MessageRepository