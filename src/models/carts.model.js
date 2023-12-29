const { Schema, model } = require('mongoose')

const colleciton = 'carts'

const CartSchema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number            
        }]
    }
})

CartSchema.pre('findOne', function(){
    this.populate('products.product')
})

const cartModel = model(colleciton, CartSchema)

module.exports = { cartModel }