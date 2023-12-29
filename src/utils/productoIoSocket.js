const ProductDaoMongo = require("../Daos/Mongo/productsDaoMongo")

exports.productsIoSocket = (io) => {
    io.on('connection', async (socket)=>{

        const serviceProducts = new ProductDaoMongo()
        const filter = {isActive: true}
        const { docs } = await serviceProducts.get({filter})
        // console.log(docs)
        io.emit('products', docs)

        socket.on('addProduct', async newProduct => { 
            console.log(newProduct)
            const result = await serviceProducts.create(newProduct)
            console.log('result: ',result)
            const { docs } = await serviceProducts.get({})
            io.emit('products', docs)
        }) 
    })
}