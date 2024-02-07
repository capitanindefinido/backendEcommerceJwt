const { productModel } = require("../../models/products.model")

class ProductDaoMongo {
    constructor(){
    }
    async get({filter={isActive: true}, limit=10, page=1, sort={price: 1}}){        
        return await this.model.paginate(filter, {limit, page, sort, lean: true})
        // return await this.model.find({})
    }
    async getBy(filter){
        return  await this.model.findOne(filter)
    }
    async create(newProduct){
        return await this.model.create(newProduct)
    }
    async update(pid, productToUpdate){
        return await this.model.findByIdAndUpdate({_id: pid}, productToUpdate)
    }
    async delete(pid){
        // return await this.model.findByIdAndDelete({_id: pid})
        return await this.model.findByIdAndUpdate({_id: pid}, {isActive: false})
    }
}
module.exports = ProductDaoMongo
