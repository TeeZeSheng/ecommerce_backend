const User = require("../models/User");
const WishList = require("../models/WIshlist");
const catchAsync = require("../utils/catchAsync");
const mongoose = require('mongoose')

exports.addToWishList = catchAsync( async(req, res, next) => {
    const wishList = await WishList.create(req.body)
    const user = await User.findByIdAndUpdate(req.body.user_id, { $push: {wishList: wishList._id} })

    res.status(200).json({
        status: 'success',
        wishList,
        user
    })
})

exports.getWishListItem = catchAsync( async (req, res, next) => {
    const user_id = req.params.id
    const wishList = await WishList.aggregate([
        {
            $match: {user_id: new mongoose.Types.ObjectId(user_id)}
        }
    ])

    res.status(200).json({
        status: 'success',
        wishList
    })
})