const { Router } = require('express')

const ProductController = require('../../controllers/products.controller')

const router = Router()

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductController()

router
    .get('/', getProducts)
    .post('/', createProduct)
    .get('/:pid', getProduct)
    .put('/:pid', updateProduct)
    .delete('/:pid', deleteProduct)



module.exports = router