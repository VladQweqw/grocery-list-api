const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GrocerySchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please choose a title'],
        unique: true
    },
    list: [{
        type: {
            name: {
                type: String,
                required: [true, 'Please add an name'],
                unique: true,
            },
            isChecked: {
                type: Boolean,
                required: [true, 'Please choose the state']
            }
        },
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, {
    timestamps: true
})


const GroceryList = mongoose.model('list', GrocerySchema)
module.exports = GroceryList