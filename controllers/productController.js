const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Session = require("../models/Session");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require('./../utils/apiFeatures')
const mongoose = require('mongoose')

exports.addProduct = catchAsync(async  (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(200).json({
        status: 'success',
        product
    })

})

exports.getAllProduct = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Product.find(), req.query).filter().sort().limitFields().paginate();
    const products = await features.query;

    res.status(200).json({
        status: "success",
        data: {
            products
        },
        results: products.length
    });

})

exports.getOneProduct = catchAsync(async (req, res, next) => {
    console.log(req.cookie)
    // const session = await Session.findById(req.body.session)
    const product = await Product.findById(req.params.id)
    const user = await User.findById(req.body.user_id).populate('wishList')

    let wishList = user.wishList
    let inWishList = {}

    for (let w of wishList) {
        if (w.name === product.name) {
            if(product.color.includes(w.color)){
                inWishList[w.color] = 'true'
            }
        }
        
    }

    res.status(200).json({
        status: "success",
        data: {
            product
        },
        inList: inWishList
    })
})

exports.addToCart = catchAsync( async (req, res, next) => {
    console.log(req.body)
    console.log(req.body.selected_color)
    const cart = await Cart.create({
        product_id: new mongoose.Types.ObjectId(req.body._id),
        product_name: req.body.name + " (" + req.body.selected_color.color + ")",
        size: req.body.selected_size,
        color: req.body.selected_color,
        user_id: new mongoose.Types.ObjectId("66df144bfb6717ad92a34ef2"),
        price_id: req.body.price_id,
        display_image: req.body.img_url[req.body.selected_color]
    })
    const user  = await User.findByIdAndUpdate("66df144bfb6717ad92a34ef2",{ $push: { cart: req.body } },  // Add to the cartitem array
        { new: true, useFindAndModify: false }) // Return the updated document and avoid deprecated options;
    const product = req.body
    res.status(200).json({
        status: "success",
        product,
        cart
    })
})

exports.getCartItem = catchAsync( async (req, res, next) => {
    const cart = await User.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId("66df144bfb6717ad92a34ef2") }
          },
          {
            // Include the cart field
            $project: {
              cart: 1        
            }
          }
    ])

    

    res.status(200).json({
        status: "success",
        cart
    })
})