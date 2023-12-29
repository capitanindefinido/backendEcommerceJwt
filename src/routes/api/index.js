const { Router }     = require('express')
const viewsRouter    = require('../views.router')
const productsRouter = require('./products.router')
const sessionsRouter = require('./sessions.router')
// const userRouter = require('./users.ro  uter')
const cartsRouter    = require('./carts.router')
const pruebasRouter  = require('./pruebas.router')
const messagesRouter = require('./messages.router.js')
const usersRouter    = require('./users.router.js')
const SessionsRouter = require('./sessionClass.router')
 
const router         = Router()
// const userRouter    = new UsersRouter()
// const sessionsRouter = new SessionsRouter()

router.use('/', viewsRouter) // vista -> template html del cliente
router.use('/api/products', productsRouter) // endpoint 
router.use('/api/users', usersRouter)
// router.use('/api/sessions', sessionsRouter.getRouter())
router.use('/api/sessions', sessionsRouter)
router.use('/api/carts', cartsRouter)
router.use('/api/messages', messagesRouter)
router.use('/pruebas', pruebasRouter)

module.exports = router