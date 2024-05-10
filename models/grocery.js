const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GrocerySchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please choose a title'],
        unique: true
    },
    list: [{
        type: String,
    }],
    user: {
        type: Schema.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
})

const GroceryList = mongoose.model('list', GrocerySchema)
module.exports = GroceryList