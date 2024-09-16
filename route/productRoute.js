const express = require('express');
const productController = require('./../controllers/productController')


const router = express.Router();

router.post('/', productController.addProduct)
router.get('/', productController.getAllProduct)
router.post('/getOneProduct/:id', productController.getOneProduct)
router.post('/addToCart', productController.addToCart)
router.get('/getCartItem', productController.getCartItem)

module.exports = router;