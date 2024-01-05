const { productService } = require("../service/service")

class ProductController {
    constructor(){
        this.service = productService
    }

    async getProducts(req,res){
        try {
            const {limit = 10, page= 1, order=1, category} = req.query
            const filter = category ? {category, isActive: true} : {isActive: true}
            const products = await productService.getProducts({ filter, limit, page, sort: {price: order} })
            console.log('products controller: ', products)
            
            if (!products) {
                res.send({status: 'error', error: 'que no se encontraron productos'})
            }

            res.send({status: 'success', payload: products})
        } catch (error) {
            console.log(error)
        }
    }
    async getProduct(req,res){
        try {
            const { pid } = req.params
            const filtro = {_id: pid}
            const product = await productService.getProduct(filtro)
            res.send({status: 'success', payload: product})
        } catch (error) {
            console.log(error)
        }
    }
    async createProduct(req,res){
        try {
            const newProduct = req.body
            console.log(newProduct.title)
            // if (!newProduct.title  && !newProduct.code && !newProduct.price && !newProduct.stock) {
            if (!newProduct.title  ) {
                return res.send({status: 'error', error: 'El producto tiene que tener todos los campos'})
            }
    
            let result =  await productService.createProduct(newProduct)
            res.send({
                status: 'success',
                payload: result
            })
        } catch (error) {
            console.log(error)
        }
    }
    async updateProduct(req,res){
        try {
            const {pid} = req.params
            const newProduct = req.body
            const result = await productService.updateProduct(pid, newProduct)
            res.send({
                status: 'success',
                payload: result
            })
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProduct(req,res){
        try {
            const { pid } = req.params
            // console.log(pid)
            const result = await productService.deleteProduct(pid)
            console.log(result)
            res.send({
                status: 'success',
                message: 'Product deleted'
            })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ProductController