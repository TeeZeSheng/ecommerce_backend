const express = require('express');
const wishListController = require('../controllers/wishListController')

const router = express.Router();

router.post('/addToWishList', wishListController.addToWishList )
router.get('/getWishList/:id', wishListController.getWishListItem)
router.post('/deleteWishlist/:id', wishListController.deleteWishlistItem)

module.exports = router

