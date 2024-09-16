const mongoose = require('mongoose')
const slugify = require('slugify');
const validator = require('validator')

const productSchema = mongoose.Schema({
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
    img_url: {
        type: Object,
        required: [true, 'image cannot be empty']
    },
    size: {
        type: [String],
        enum: ['S', 'M', 'L', 'XL']
    },
    color: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
    },
    display_image: {
        type: String,
        required: true
    },
    price_id: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;