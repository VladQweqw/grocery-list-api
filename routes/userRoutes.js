const { Router } = require('express')
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/authMiddleware')

const router = Router()

router.post('/login', userController.user_login_post)
router.post('/register', userController.user_register_post)


router.get('/user/:id', verifyToken, userController.user_details_get)
router.delete('/user/:id', verifyToken, userController.user_delete)
router.put('/user/:id', verifyToken, userController.user_update_put)
router.get('/logout', verifyToken, userController.user_logout_get)

module.exports = router