const jwt = require('jsonwebtoken')
const { productService } = require("../service/service")
const { authToken } = require("../utils/jsonwebtoken")
const { productModel } = require('../models/products.model')
const { sendMail } = require("../utils/sendMail.js");

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
    async createProduct(req, res) {
        try {
            const newProduct = req.body;
            const token = req.cookies.cookieToken   
            let user = jwt.verify(token, 'secret')
            // Verificar que el usuario esté autenticado
            if (!user) {
                return res.status(401).send({ status: 'error', error: 'Usuario no autenticado' });
            }
    
            // Agregar el rol del usuario al producto
            newProduct.emailOwner = user.email;
            newProduct.createBy = user.role;
            // Crear el producto
            const result = await productService.createProduct(newProduct);
    
            res.send({
                status: 'success',
                payload: result
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
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
            const product = await productModel.findById(pid)
            const productOwner = product._doc.createBy
            const productOwnerEmail = product._doc.emailOwner
            if(productOwner == 'user-premium'){
                await sendMail({
                    to: productOwnerEmail,
                    subject: "Se elimina producto con owner Premium",
                    html: "Se elimina producto correctamente."
                  });
            }
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