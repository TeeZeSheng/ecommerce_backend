const express = require('express');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');


const router = express.Router();

router.get('/checkout-session/:id', bookingController.getCheckoutSession);

router.get('/priceId', bookingController.getPriceId)

module.exports = router;