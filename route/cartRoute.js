const express = require('express');
const cartController = require('../controllers/cartController')
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.post('/getCartItem', cartController.getCartItem)
router.get('/getCartItem/:id', cartController.getCart, bookingController.getCheckoutSession)
router.post('/updateQuantity', cartController.updateQuantity, cartController.getCartItem)
router.get('/purchaseComplete/:id', cartController.purchaseComplete)

module.exports = router;