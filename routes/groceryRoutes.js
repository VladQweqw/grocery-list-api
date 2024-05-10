const { Router } = require('express')
const groceryController = require('../controllers/groceryController')

const router = Router()

router.get('/', groceryController.lists_get)
router.post('/', groceryController.lists_post)

router.get('/list/:id', groceryController.list_detail_get)
router.delete('/list/:id', groceryController.list_delete_delete)
router.put('/list/:id', groceryController.list_update_put)


module.exports = router