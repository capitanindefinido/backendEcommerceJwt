const { Router } = require('express')
const { generateUsers } = require('../../utils/fakerUsers.js')
const { fork }   = require('child_process')
const { sendMail } = require('../../utils/sendMail')
const { sendSms, sendWhatsapp } = require('../../utils/sendSms')
const { faker } = require('@faker-js/faker')

const compression = require('express-compression')

const router = Router()

router.get('/test/user', (req, res)=>{
    
    res.send({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    })
})

router.get('/sencilla', (req,res)=>{
    let sum = 0
    for (let i = 0; i < 1000000; i++) {
        sum += 1        
    }
    res.send({sum})
})
router.get('/compleja', (req,res)=>{
    let sum = 0
    for (let i = 0; i < 5e8; i++) {
        sum += 1        
    }
    res.send({sum})
})

// artillery quick --count 40 --num 50 'http://localhost:8080/pruebas/sencilla' -o simple.json
// artillery quick --count 40 --num 50 'http://localhost:8080/pruebas/compleja' -o compleja.json

// artillery run config.yml --output testPerformance.json
// artillery report testPerformance.json -o testResults.html


// router.get('/warning', (req, res)=>{
//     // req.logger.warning('Warning en la ruta de prueba')
//     // req.logger.fatal('Warning en la ruta de prueba')
//     req.logger.error('Warning en la ruta de prueba')

//     res.send('ejecutando el warning')
// })

// compression con gzip
// router.use(compression()) 2.35 / 7.64 kb 74ms

// compression con brotli    2.35 / 840 B kb 114ms
// router.use(compression({
//     brotli: {
//         enabled: true,
//         zlib:{}
//     }
// }))


// router.get('/comp', (req, res)=>{
//     let string = 'Hola coders, soy un string ridiculamente largo.'
//     for (let i = 0; i < 5e4; i++) {
//         string += 'Hola coders, soy un string ridiculamente largo.'        
//     }
//     res.send(string)
// })






// mock con faker js

// router.get('/users', (req,res) => {
//     let users = []

//     for (let i = 0; i < 100; i++) {
//         users.push(generateUsers())
        
//     }
//     res.send({
//         status: 'sucess',
//         payload: users
//     })
// })

// router.get('/sms', async (req, res) => {
   
//     // sendSms('Federico', 'osandón')
//     // para whatsapp
//     sendWhatsapp('Federico', 'osandón')
//     res.send('sms enviado')
// })
// router.get('/mail', async (req, res) => {
//     const html = `<div>
//             <h1>Bienvenidos a app ecomerce c58070</h1>
//         </div>`
//     await sendMail('projectodigitalgen@gmail.com', 'gracias por registrarte', html)
//     res.send('Mail enviado')
// })

// const operacionCompleja = ()=>{
//     let result = 0
//     for (let i = 0; i <10e9; i++) {
//         result +=i         
//     }
//     return result
// }

// router.get('/block', (req, res) => { 
    
//     const result = operacionCompleja()
//     res.send({
//         message: `El resultado es: ${result}`
//     })
// })


// router.get('/no-block', (req, res) => {
//     const child = fork('./src/routes/api/operacionComp.js') 
//     child.send('Inicia el cáclulo por favor')
//     child.on('message', result => {
//         res.send({
//             message: `El resultado es: ${result}`
//         })
//     })
// })




// // expresiones regular 
// // router.get('/diccionary/:word([a-zA-Z]+)', async (req, res)=>{
// //     const { word } = req.params
// //     res.send({word})
// // })

// router.param('word', async (req,res,next, word) => {
//     let arrayWord = ['gorras', 'dados']
//     let searchword = arrayWord.find(palabra => word === palabra)
//     console.log(searchword)
//     if (!searchword) {
//         req.word = null
//     }else{
//         req.word = searchword
//     }
//     next()
// })

// // utf-8 ñ, í. á. é, ó. ú -> á = %C3%A1 é= %C3%A9
// router.get('/:word([a-z%C3%A1%C3%A9]+)', async (req, res)=>{
//     if (req.word) {
//         return res.send(req.word)
//     }else{
        
//         return res.send({message: 'no existe en la base de datos'})
//     }
//     const { word } = req.params
    
    
// })
// router.post('/:word([a-z%C3%A1%C3%A9]+)', async (req, res)=>{
//     const { word } = req.params
    
//     res.send({word})
// })

// // captura todas las rutas que no coincidan con las existentes
// router.get('*', async (req, res)=>{
//     res.status(404).send({status: 'error', message: 'ruta no encontrada'})
// })




// // _____________________________________________ clase 18 _________________________________________________________________
// router.get('/setcookies', async (req, res) => {
    
//     res.cookie('coderCookie', 'esta es la info de la cookie', {maxAge: 10000000}).send('cookie seteada')
// })

// // archivo de texto { coderCookie: 'esta es la info de la cookie' }

// router.get('/getcookies', (req,res)=>{
//     console.log(req.cookies)
//     res.send(req.cookies)
// })

// // Ruta con cookie firmadas
// router.get('/setsignedcookies', async (req, res) => {
    
//     res.cookie('coderCookie', 'esta es la info de la cookie firmada y poderosa', {maxAge: 10000000, signed: true}).send('cookie seteada')
// })

// // Ruta con cookie firmadas
// router.get('/getsignedcookies', (req,res)=>{
//     console.log(req.signedCookies)
//     res.send(req.signedCookies)
// })

// router.get('/deletecookies', (req,res)=> {
//     res.clearCookie('coderCookie').send('Cookie borradas')
// })

// router.get('/session', (req,res) => {
//     if (req.session.counter) {
//         req.session.counter++
//         res.send(`Se ha visitado el sitio ${req.session.counter} veces.`)
//     } else {
//         req.session.counter = 1
//         res.send('<h1>BIenvenidos</h1>')
//     }
// })

// router.post('/login', (req,res) => {
//     const {email, password} = req.body
//     // validando como si buscara los datos en la bd
//     if (email !== 'f@gmail.com' || password !== '123456') {
//         return res.send('login fallido')
//     }
    
//     req.session.user = email 
//     req.session.admin = true
//     res.send('login success')
// })

// router.get('/logout', (req,res)=>{
//     req.session.destroy(err=> {
//         if(err) res.send({status: 'logout error', error: err})
//         res.send('logout exitoso')
//     })
// })
// _______________________________________________________________________________________________________________________

module.exports = router