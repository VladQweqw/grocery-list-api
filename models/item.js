const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemScheme = new Schema({
    name: {
        type: String,
        required: true,
    },
    isChecked: {
        type: Boolean,
        required: true,
    },
    origin_list: {
        type: Schema.Types.ObjectId,
        ref: "list",
        required: true,
    }
})


const Items = mongoose.model('item', ItemScheme)
module.exports = Items