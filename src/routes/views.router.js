const { Router }        = require('express')
const { passportCall }  = require('../middleware/passportCall')
const { authorization } = require('../middleware/authorization.middleware')
const { userModel }     = require('../models/user.model')
const ProductDaoMongo   = require('../Daos/Mongo/productsDaoMongo')
const CartManagerMongo  = require('../Daos/Mongo/cartsDaoMongo')
const UserManagerMongo  = require('../Daos/Mongo/usersDaoMongo')
const {
    login,
    resetPasword,
    changePassword
} = require('../controllers/views.controller.js')
const { productModel } = require('../models/products.model.js')
const UserDaoMongo = require('../Daos/Mongo/usersDaoMongo')
const jwt = require('jsonwebtoken')
const TicketDaoMongo = require('../Daos/Mongo/ticketsDaoMongo.js')
const { nanoid } = require('nanoid')


const router           = Router()
const cartManagerMongo = new CartManagerMongo()
const ticketManagerMongo = new TicketDaoMongo()

router
    .get('/login', login)
    .get('/forgot-password', resetPasword)
    .get('/change-password', [], changePassword)
    .get('/register', (req,res)=>{
        res.render('register', {
            showNav: false
        })
})

router.get('/profile', [
    passportCall('jwt'),
    ], async (req,res)=>{
        try {
            const userManagerMongo = new UserManagerMongo()
            let serviceUsers = new UserDaoMongo()
            let email = req.user.email
            const user = await userModel.findOne({ email });
            const token = req.cookies.cookieToken
    
            //let userCart = jwt.verify(token, 'secret')
            const idCartUser = await serviceUsers.getIdCartByEmailUser(user.email)
            res.render('profile', {
                showNav: true,
                user: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                },
                cartId : idCartUser,
            })
        } catch (error) {
            console.log(error)
        }
        
    }
)

router.get('/', async (req, res)=>{
    const {limit, numPage, sort} = req.params
    let serviceProducts = new ProductDaoMongo()
    let serviceUsers = new UserDaoMongo()
    const {
        docs,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage,
        page
    } = await serviceProducts.get({limit, page: numPage, sort: {price: sort}, lean: true})

    /* const token = req.cookies.cookieToken
    
    let user = jwt.verify(token, 'secret')
    const idCartUser = await serviceUsers.getIdCartByEmailUser(user.email) */
    
    res.render('index', {
        showNav: true,
        /* cartId : idCartUser,
        user: user, */
        name: 'federico',
        products: docs,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage,
        page
    })
})

// http://localhost:8080/products?limit=3&page (vista) http://localhost:8080/api/products
// producto 
router.get('/products', async (req, res) => {
    // lógica
    const {limit, numPage, sort} = req.params
    let serviceProducts = new ProductManagerMongo()
    const {
        docs,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage,
        page
    } = await serviceProducts.getProducts({limit, page: numPage, sort: {price: sort}, lean: true})

    res.status(200).render('products', {
        products: docs,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage,
        page
    })
})

// Vista del detalle del producto
router.get('/product-detail/:pid', async (req, res) => {
    const product = await productModel.findById(req.params.pid)
    res.status(200).render('productDetail',{
        showNav: true ,
        product: product._doc   
    })
})

// vista del formulario de modificación del producto
router.get('/product-edit-form/:pid', async (req, res) => {
    const product = await productModel.findById(req.params.pid)
    res.status(200).render('productEditForm',{
        showNav: true,
        product: product
    })
})

router.get('/realtimeproducts',[
    passportCall('jwt'), 
    authorization(['ADMIN']),
    ],   
    async (req, res) => {
        res.status(200).render('realTimeProduct',{
            showNav: true            
        })
    }
)

/*router.get('/carts', [ 
    passportCall('jwt'), 
    authorization(['USER']), 
    ], async (req, res) => {        
        // en esta parte tengo que tener el token con el users._id
        const cart = await cartManagerMongo.getBy({_id: '65975c914af1fd5fe39e9e18'})
        // console.log(cart)
        res.status(200).render('carts', {
            showNav: true,
            products: cart.products,
            cid: cart._id            
        })
    }
)*/

router.get("/carts/:cid",[ 
    passportCall('jwt'), 
    authorization(['USER']), 
    ], async (req, res) => {
    let id = req.params.cid
    let emailActive = req.query.email
    let allCarts  = await cartManagerMongo.getCartWithProducts(id)
    allCarts.products.forEach(producto => {
        producto.total = producto.quantity * producto.product.price
    });
    const sumTotal = allCarts.products.reduce((total, producto) => {
        return total + (producto.total || 0);  // Asegurarse de manejar casos donde total no esté definido
    }, 0);
    res.render("carts", {
        title: "Vista Carro",
        carts : allCarts,
        user: emailActive,
        calculateSumTotal: products => products.reduce((total, producto) => total + (producto.total || 0), 0)
    });
})


router.get("/checkout", async (req, res) => {
    let cart_Id = req.query.cartId
    let purchaser = req.query.purchaser
    let totalAmount = req.query.totalPrice
    let newCart = await cartManagerMongo.create(purchaser)
    let newIdCart = newCart._id.toString()
    //let updateUser = await UserManagerMongo.updateIdCartUser({email: purchaser, newIdCart})
    if(newCart)
    {
        const newTicket = {
            code: nanoid(),
            purchase_datetime: Date(),
            amount:totalAmount,
            purchaser: purchaser,
            id_cart_ticket:cart_Id
       }
       let result = await ticketManagerMongo.addTicket(newTicket)
       const newTicketId = result._id.toString();
       // Redirigir al usuario a la página del ticket recién creado
       res.redirect(`/tickets/${newTicketId}`);
    }
     
})

router.get("/tickets/:tid", async (req, res) => {
    let id = req.params.tid
    let allTickets  = await ticketManagerMongo.getTicketById(id)
    res.render("viewTicket", {
        title: "Vista Ticket",
        tickets : allTickets
    });
})
// protejer con jwt passport
// passport.authenticate('jwt', {session: false}) envolver en una función
// router.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
    // user admin
router.get('/users', [
        passportCall('jwt'), 
        authorization(['ADMIN'])
    ], async (req, res) => {
        try {
            const {numPage=1, limit=20, query=''} = req.query
            let {
                docs,
                hasPrevPage, 
                hasNextPage,
                prevPage,
                nextPage,
                page
                // totalPages
            } = await userModel.paginate({}, {limit, page: numPage, lean: true})
                // console.log(totalPages)
            // console.log(docs)
            // if () {
                
            // }
            // console.log(users)
            res.status(200).render('users', {
                showNav: true,
                users: docs,
                hasPrevPage, 
                hasNextPage,
                prevPage,
                nextPage,
                page
            })

        } catch (error) {
            console.log(error)
        }   
    })

// chat
router.get('/chat', [ 
        passportCall('jwt'), 
        authorization(['USER', 'USER-PREMIUM', 'ADMIN'])
    ], 
    (req, res) => {
        res.render('chat', {showNav: true})
})

router.get('/contacto', (req,res) => {
    
    res.render('contactos', {nombre: 'Fede', showNav: true})
})

// vista del carrito
// vista del product / todos  / el detalle
// profile
// contactenos. 


module.exports = router