const { cartModel } = require("../../models/carts.model");

class CartDaoMongo {
    constructor(){
        this.model = cartModel
    }
    
    async getBy(condition){
        return await this.model.findOne(condition).lean()
    }

    async create(){
        return await this.model.create({
            products:[],
        })
    }
    
    async addItemToCart({cid, pid, quantity}){        
        const updatedCart =  await this.model.findOneAndUpdate(
            {_id: cid, 'products.product':  pid},
            {$inc: {'products.$.quantity': quantity}}, // producto actual resultado de dal búsqueda
            {new: true} // hace que retorne el elemento modificado
            // {new: true, upsert: true, setDefaultsOnInsert: true} // hace que retorne el elemento modificado
        )
        if (updatedCart) { // condición que depende si encontro el producto
            // El producto ya estaba en el carrito, se actualizó su cantidad
            return updatedCart
        }      
        // El producto no estaba en el carrito, se agrega con quantity seleccionada
        const newProductInCart = await this.model.findOneAndUpdate(
            { _id: cid },
            { $push: { products: { product: pid, quantity } } },
            { new: true, upsert: true }
        )
        return newProductInCart
    }

    async deleteItemToCart({cid, pid}){
        return await this.model.findOneAndUpdate({_id: cid}, {$pull: {products: {product: pid}}}, {new: true})
    }
}

module.exports = CartDaoMongo


// Parámetros: La función toma un solo argumento llamado data, que parece ser un objeto que contiene información 
// relevante para agregar un producto al carrito. El objeto data contiene tres propiedades: cid (que parece ser un identificador del carrito), 
// pid (que parece ser un identificador del producto) y quantity (que representa la cantidad del producto a agregar al carrito).

// Primera parte (Actualización del producto existente):

// La función intenta encontrar un documento en la colección que coincida con dos criterios: 
// el _id del carrito (_id: data.cid) y que haya un elemento en la matriz products con un campo product igual a data.pid.
// Si se encuentra un documento que cumple con esos criterios, la función utiliza la operación 
// $inc para incrementar la cantidad del producto existente en el carrito en la cantidad especificada (data.quantity).
// El {new: true} en la operación findOneAndUpdate significa que se devolverá el documento modificado después de la actualización y 
// se almacenará en la variable updatedCart.
// Manejo de casos:

// La función verifica si updatedCart contiene un documento. Si es así, esto significa que el producto ya estaba en el carrito y su cantidad se ha actualizado. En este caso, se devuelve el carrito actualizado.
// Segunda parte (Agregar un nuevo producto):

// Si no se encuentra un documento que cumpla con los criterios en la primera parte (lo que significa que el producto no estaba en el carrito), la función intenta agregar un nuevo producto al carrito.
// Se utiliza una segunda operación findOneAndUpdate con { $push: { products: { product: data.pid, quantity: data.quantity } } } para agregar un nuevo elemento a la matriz products en el carrito. El {new: true, upsert: true} asegura que, si no existe un carrito con el _id especificado, se cree uno nuevo.
// El carrito actualizado o el nuevo carrito se almacena en la variable newProductInCart y se devuelve.