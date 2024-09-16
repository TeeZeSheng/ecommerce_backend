const mongoose = require('mongoose')
const slugify = require('slugify');
const validator = require('validator')

const cartSchema = mongoose.Schema({
    product_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
    },
    product_name:{
        type: String,
        required: true,
    },
    size:{
        type: String,
        enum: {values: ['S', 'M', 'L', 'XL', ''],
            message: 'Invalid value. (Must be S, M, L, XL)',
          }
    },
    color:{
        type: String
    },
    user_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    price_id:{
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    display_image: {
        type: String,
        required: true,
    }
})

cartSchema.index({ date: -1 })

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;