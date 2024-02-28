const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    }
}, { timestamps: true});

const Card = mongoose.model('Card', cardSchema)
module.exports = Card;