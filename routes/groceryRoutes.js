const { Router } = require('express')
const groceryController = require('../controllers/groceryController')
const verifyToken = require('../middleware/authMiddleware')

const router = Router()

router.get('/', verifyToken, groceryController.lists_get)
router.post('/', verifyToken, groceryController.lists_post)

router.get('/list/:id', verifyToken, groceryController.list_detail_get)
router.delete('/list/:id', verifyToken, groceryController.list_delete_delete)
router.put('/list/:id', verifyToken, groceryController.list_update_put)
router.put('/item', verifyToken, groceryController.list_item_check_toggle_put)


module.exports = router