const { Router } = require('express')

const {
    getUsers,
    createUser, 
    updateUser,
    deleteUser,
    premiumUser,
    subirArchivo,
    deleteUsers,
    modRole
} = require('../../controllers/users.controller.js')

const router = Router()

// rutas para usuarios
router.get('/',                getUsers)
router.post('/',               createUser)
router.post('/:uid',           modRole);
router.put('/:uid',            updateUser)
router.delete('/:uid',         deleteUser)
router.put('/premium/:uid',    premiumUser)
router.post('/:uid/documents', subirArchivo)
router.delete('/',             deleteUsers)

module.exports = router