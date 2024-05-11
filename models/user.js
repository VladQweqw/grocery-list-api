const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    nickname: {
        type: String,
        required: [true, 'Please enter a nickname'],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password is too short']
    },
    lists: [{
        type: Schema.Types.ObjectId,
        ref: 'list'
    }]

}, {
    timestamps: true
})

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email })

    if(user) {
        const auth = await bcrypt.compare(user.password, password)

        if(auth) return user
        throw Error('Incorrect Password')
    }

    throw Error('Incorrect Email')
}


const User = mongoose.model('user', UserSchema)
module.exports = User