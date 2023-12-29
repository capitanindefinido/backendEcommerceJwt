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


const router           = Router()
const cartManagerMongo = new CartManagerMongo()

router
    .get('/login', login)
    .get('/forgot-password', resetPasword)
    .get('/change-password', [], changePassword)
    .get('/register', (req,res)=>{
        res.render('register', {
            showNav: false
        })
})

router.get('/profile',
    passportCall('jwt'),
    authorization(['USER', 'USER_PREMIUN', 'ADMIN']),
    async (req,res)=>{
        const userManagerMongo = new UserManagerMongo()
        const user = await userManagerMongo.getBy({email: req.user.email})
        
        res.render('profile', {
            showNav: true,
            user: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        })
    }
)

router.get('/', async (req, res)=>{
    const {limit, numPage, sort} = req.params
    let serviceProducts = new ProductDaoMongo()
    const {
        docs,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage,
        page
    } = await serviceProducts.get({limit, page: numPage, sort: {price: sort}, lean: true})


    res.render('index', {
        showNav: true,
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
router.get('/product-detail/:pid', (req, res) => {
    res.status(200).render('productDetail',{
        showNav: true    
    })
})

// vista del formulario de modificación del producto
router.get('/product-edit-form/:pid', (req, res) => {
    res.status(200).render('productEditForm',{
        showNav: true
    })
})

router.get('/realtimeproducts',  
    // passportCall('jwt'), 
    // authorization('user'), 
    (req, res) => {
        res.status(200).render('realTimeProduct',{
            showNav: true            
        })
    }
)

router.get('/carts',  
    // passportCall('jwt'), 
    // authorization('user'), 
    async (req, res) => {        
        // en esta parte tengo que tener el token con el users._id
        const cart = await cartManagerMongo.getBy({_id: '651c3fe98e5062e4fb9090ec'})
        // console.log(cart)
        res.status(200).render('carts', {
            showNav: true,
            products: cart.products,
            cid: cart._id            
        })
    }
)

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
        authorization(['USER', 'USER_PREMIUN', 'ADMIN'])
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