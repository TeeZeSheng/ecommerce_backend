const Product = require('../models/Product');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/Tour');
const Stripe = require('stripe')
const Cart = require("../models/Cart");
const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY)

exports.getCheckoutSession =  catchAsync(async (req, res, next) => {
    
    const tour = await Tour.findById(req.params.tourId);
    const priceId = req.params.priceId;
    
    const cart = await Cart.aggregate([
        {
            $match: {user_id: new mongoose.Types.ObjectId(req.params.id)}
        },
        {
            $group: {
                _id: { price_id: "$price_id" , color: "$color", size: "$size" },  // Group by both product_id and color
                quantity: { $sum: 1 }  // Add an accumulator for counting the occurrences, if needed
            }
        },
        {
            $project:{
                _id: 0,
                price: "$_id.price_id",
                quantity: 1
            }
        }
        

    ])

    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
    mode: 'payment',
    line_items: cart,
    // line_items: [
    //     {
    //     price: 'price_1PxUG6KRO5k2Lh6gqXY3SSOZ',
    //     // For metered billing, do not pass quantity
    //     quantity: 1,
    //     },
    //     {
    //         price: 'price_1PxUG6KRO5k2Lh6gqXY3SSOZ',
    //         // For metered billing, do not pass quantity
    //         quantity: 1,
    //     },
    // ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    return_url: `http://localhost:8080/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    
    res.send({clientSecret: session.client_secret});
})

const getLineItems = catchAsync(async (user_id) => {
    const cart = await Cart.aggregate([
        {
            $match: {user_id: new mongoose.Types.ObjectId(user_id)}
        },
        {
            $group: {
                _id: { price_id: "$price_id" , color: "$color", size: "$size" },  // Group by both product_id and color
                quantity: { $sum: 1 }  // Add an accumulator for counting the occurrences, if needed
            }
        },
        {
            $project:{
                _id: 0,
                price: "$_id.price_id",
                quantity: 1
            }
        }
        

    ])

    return cart
})

exports.getPriceId = catchAsync( async (req, res, next) => {
    const prices = await stripe.prices.list({active: true, limit: 15});

    try {
        await Promise.all(

            prices.data.map(async (p) => {
            console.log(p.name)
          const result = await Product.findOneAndUpdate(
            { product_id : p.product }, 
            { price_id : p.id  }
          );
        }));
      } catch (error) {
        console.error('Error updating documents:', error);
      }

    res.status(200).json({
        prices
    })

    
})

exports.getProductId = catchAsync( async (req, res, next) => {
    const products = await stripe.products.list({ active: true, limit: 15 });

    // products.data.map(async (p, i) => {
    //     try{
    //     await Product.updateMany({ name: p.name }, {$set: {"product_id": p.id}})}catch(e) {
    //         console.log(e)
    //     }
    // })
    
      let result = prices.data
    //   let product
    // for (let product of products.data) {
    //     const update = await Product.findOneAndUpdate({name: product.name}, {product_id: product.id})
    // }
    console.log(products.data[0].name)
 
    //   result.map(async (r, i) =>  {
    //     product = await Product.updatemany({}, {$set: {"price_id": r.id}})
    //   })

    try {
        await Promise.all(

            products.data.map(async (p) => {
            console.log(p.name)
          const result = await Product.findOneAndUpdate(
            { name : p.name }, 
            { product_id : p.id  }
          );
          console.log(`Updated ${result.modifiedCount} documents for product: ${p.name}`);
        }));
      } catch (error) {
        console.error('Error updating documents:', error);
      }
      
      
    
    res.status(200).json({
        products
    })
})