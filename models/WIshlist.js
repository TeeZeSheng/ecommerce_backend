const mongoose = require('mongoose')
const slugify = require('slugify');
const validator = require('validator')

const wishlistSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be empty'],

    },
    product_type: {
        type: String,
        required: [true, 'Type cannot be empty'],

    },
    price: {
        type: Number,
        required: [true, 'price cannot be empty'],
        min: 1
    },
    color: {
        type: String,
        required: true,
    },
    display_image: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        required: true
    }

})

const WishList = mongoose.model('WishList', wishlistSchema);

module.exports = WishList;