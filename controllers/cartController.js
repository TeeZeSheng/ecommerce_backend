const Cart = require("../models/Cart");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose")

exports.getCartItem = catchAsync(async (req, res, next) => {
    let user_id = req.body.id
    const cart = await Cart.aggregate([
        {
            $match: { user_id: new mongoose.Types.ObjectId(user_id) }  // Match the user_id
        },
        {
            $group: {
                _id: { product_id: "$product_id" , color: "$color", size: "$size", display_image: "$display_image" },  // Group by both product_id and color
                count: { $sum: 1 },  // Add an accumulator for counting the occurrences, if needed
                latest_date: { $max: "$date" }
            }
        },
        {
            $lookup: {
                from: "products",  // The name of the Product collection
                localField: "_id.product_id",  // Field in the Cart document
                foreignField: "_id",  // Field in the Product collection
                as: "productDetails"  // Output array field with populated product details
            }
        },
        {
            $unwind: "$productDetails"  // Unwind the array to get a single object instead of an array
        },
        {
            $addFields: {
                price: { $multiply: ["$productDetails.price", "$count"] },
                name: "$productDetails.name",
                product_type: "$productDetails.product_type",
                date: "$latest_date"
            }
        },
        {
            $group: {
                _id: null,  // No grouping by a field; combine everything into one document
                cart: {  // Collect all cart items into an array
                    $push: {
                        product_id: "$_id.product_id",
                        color: "$_id.color",
                        size: "$_id.size",
                        count: "$count",
                        display_image: "$_id.display_image",
                        price: "$price",
                        name: "$name",
                        product_type: "$product_type",
                        date: "$date"
                        
                    }
                },
                total_price: { $sum: "$price" }  // Calculate the total of all item prices
            }
        },
        {
            $project: {
                _id: 0,  // Exclude the _id field from the result
                cart: {
                    $sortArray: { input: "$cart", sortBy: {date: -1}}
                },  // Include the cart array
                total_price: 1  // Include the total price
                
            }
        }
       
    ]);
    

    res.status(200).json({
        status: 'success',
        cart
    })
})

exports.getCart = catchAsync(async (req, res, next) => {
    let user_id = req.params.id

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

    req.body.line_items = cart

    next();

    // res.status(200).json({
    //     status: "success",
    //     cart
    // })

})