const { Router } = require('express')

const {
    getUsers,
    createUser, 
    updateUser,
    deleteUser,
    premiumUser,
    subirArchivo,
} = require('../../controllers/users.controller.js')

const router = Router()

// rutas para usuarios
router.get('/',                getUsers)
router.post('/',               createUser)
router.put('/:uid',            updateUser)
router.delete('/:uid',         deleteUser)
router.put('/premium/:uid',    premiumUser)
router.post('/:uid/documents', subirArchivo)

module.exports = router