const express = require('express');
const wishListController = require('../controllers/wishListController')

const router = express.Router();

router.post('/addToWishList', wishListController.addToWishList )
router.get('/getWishList/:id', wishListController.getWishListItem)

module.exports = router

