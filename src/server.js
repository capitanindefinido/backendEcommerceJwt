const express = require('express')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { Server: HTTPServer } = require('http')
const { Server: IOServer } = require('socket.io')
// _________________________ passport _______________________________
const passport = require('passport')
const inizializePassport = require('./config/passport.config.js')
// __________________________________________________________________
const router = require('./routes/api/index.js')
const { messageIoSocket } = require('./utils/messageIoSocket.js')
const { productsIoSocket } = require('./utils/productoIoSocket.js')
const { configObject: {port, conectDB, cookie_key} } = require('./config/config.js')
const { errorHandleMidd } = require('./middleware/error/index.js')
const { addLogger, logger } = require('./middleware/loggers.js')
const  swaggerJSDoc  = require('swagger-jsdoc')
const  swaggerUIExpress  = require('swagger-ui-express') 

const app = express()
const httpServer = new HTTPServer(app)
const io = new IOServer(httpServer)

const PORT = port || 8080

conectDB()

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('views', __dirname+'/views') 
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname+'/public'))
app.use(express.json())
app.use(cors()) // *
app.use(cookieParser(cookie_key))

inizializePassport()
app.use(passport.initialize())

// rutas de mi aplicacion
app.use(addLogger)
app.use(router)
app.use(errorHandleMidd)

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title: 'Documentación API',
            description:'Documentación realizada con Swagger en Proyecto Backend Coderhouse'
        }
    },
    apis:[`src/docs/products.yaml`,
          `src/docs/carts.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

httpServerListen = () => httpServer.listen(PORT, err =>{
    if(err) return console.log('error en el servidor: ', err)
    logger.info('escuchando en el puerto ' + PORT)
    // console.log()  
})

// console.log('el id del proceso es: ', process.pid) // proceso globlar o principal -> 4 p.
messageIoSocket(io)
productsIoSocket(io)
httpServerListen()