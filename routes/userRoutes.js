const { Router } = require('express')
const userController = require('../controllers/userController')

const router = Router()

router.post('/login', userController.user_login_post)
router.post('/register', userController.user_register_post)

router.get('/user/:id', userController.user_details_get)
router.delete('/user/:id', userController.user_delete)
router.put('/user/:id', userController.user_update_put)

router.post('/logout', userController.user_logout)

module.exports = router