const { Router } = require('express')
const { cartModel } = require('../../models/carts.model')
const CartDaoMongo = require('../../Daos/Mongo/cartsDaoMongo')

const router = Router()
const serviceCarts = new CartDaoMongo()
// cre
// traer un carrito por id
router.get('/:cid', async (req, res) => {
    const {cid} = req.params
    // const cart = await cartModel.findOne({_id:'651c3fe98e5062e4fb9090ec'})
    const cart = await serviceCarts.getBy({_id: cid})
    // const cart = await cartModel.findOne({_id:'651c3fe98e5062e4fb9090ec'}).populate('products.product')
    // console.log(cart.products)
    res.send({
        status: 'success',
        payload: cart
    })
})

//  api/carts - PUT - /:cid
router.post('/', async (req, res) => {
    const email = req.body.userEmail
    const cart = await serviceCarts.create(email)
    res.send({
        status: 'success',
        payload: cart
    })
})



// /api/carts - PUT - /:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    const {quantity} = req.body 

   
    const result = await serviceCarts.addItemToCart({cid, pid, quantity})
    // console.log(result)
    res.send({status: 'success', payload: result})
})
// /api/carts - delete - /:cid/products/pid
router.delete('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    console.log(cid, pid)
    // Traer el carrito por el usuario que está en el token
    const result = await serviceCarts.deleteItemToCart({cid ,pid})
    console.log(result)
    res.send({status: 'success', payload: result})
})

//  api/carts - PUT - /:cid
router.put('/:cid', async (req, res) => {})

// /api/carts - delete - /:cid
router.delete('/:cid', async (req, res) => {
    res.send({status: 'success', payload: 'result'})
})

module.exports = router