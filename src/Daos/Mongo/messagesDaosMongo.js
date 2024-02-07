// persistencia/model
class MessageDaoMongo {
    constructor(){
        
    }
    get(){
        return 'get Messages'
    }
    getBy(obj){
        return 'get By Messages'
    }
    create(){
        return 'create Messages'
    }
    update(mid){
        return 'update Messages'
    }
    delete(mid){
        return 'delete Messages'
    }
}

module.exports = MessageDaoMongo