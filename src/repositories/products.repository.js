class ProductRepository {
    constructor(dao){
        this.dao = dao
    }
    getProducts = async (paginateConfig) => {
        return await this.dao.get(paginateConfig) 
    }
    getProduct = async (filter) => {
        return await this.dao.getBy(filter) 
        
    }
    createProduct = async (newProduct) => {
        return await this.dao.create(newProduct) 
        
    }
    updateProduct = async (pid, updateToProduct) => {
        return await this.dao.update(pid, updateToProduct) 

    }
    deleteProduct = async (pid) => {
        return await this.dao.delete(pid)
    }
}

module.exports = ProductRepository