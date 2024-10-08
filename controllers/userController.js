const User = require('../models/user')
const GroceryList = require('../models/grocery')
const Item = require('../models/item')

const jwt = require('jsonwebtoken')

function handleErrors(err) {
    const errors = { email: "", password: "" }
    if(err.message === 'Incorrect Password') {
        errors.password = err.message
    }

    if(err.message === 'Incorrect Email') {
        errors.email = err.message
    }

    if(err.code === 11000) {
        errors.email = 'Email already exists'
    }

    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}

const maxAge = 3 * 24 * 60 * 60 // days hours minutes seconds
function createToken(id) {
    return new Promise((resolve, reject) => {
        jwt.sign({ id }, "monkey banana", {
            expiresIn: maxAge
        }, function(err, token2) {
            if(err) reject(err)
            else resolve(token2)
        })
    })
}

async function user_register_post(req, res) {
    try {
        const new_user = await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: req.body.password
        })

        res.status(201).json({
            detail: "User Created",
            user: new_user,
        })
    }
    catch(err) {
        const errors = handleErrors(err)

        res.status(400).send({
            error: errors
        })
    }
}

async function user_login_post(req, res) {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password);
        const token = await createToken(user._id)

        res.cookie('jwt', token, {
            httpOnly: false,
            maxAge: maxAge * 1000,
        })

        const filter_user = {
            _id: user._id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            nickname: user.nickname
        }

        res.status(200).json({
            detail: "User logged in",
            user: filter_user,
            token,
        })
    }
    catch(err) {
        const errors = handleErrors(err)
        res.status(400).json({
            error: errors
        })
    }

}

function user_logout_get(req, res) {
    res.cookie('jwt', '', {
        maxAge: 1
    })

    res.json({
        detail: "User logged out"
    })
}

function user_details_get(req, res) {
    const user_id = req.params.id
    
    User.findById(user_id)
    .populate({
        path: "lists",
        model: GroceryList,
        populate: {
            path: "list",
            model: Item
        },
    })
    .then((result) => {
        const { email, nickname, _id, createdAt, lists } = result

        res.json({
            detail: {
                email,
                nickname,
                id: _id,
                createdAt,
                lists,
            }
        })
    })
    .catch((err) => {
        console.log(err);
        res.json({
            error: "Invalid ID"
        })
    })

}

function user_delete(req, res) {
    const user_id = req.params.id

    User.findByIdAndDelete(user_id)
    .then((result) => {
        res.json({
            detail: "User deleted"
        })
    })
    .catch((err) => {
        res.json({
            error: "Invalid ID"
        })
    })

}

function user_update_put(req, res) {
    const user_id = req.params.id

    if(Object.keys(req.body).length === 0) {
        res.status(400).json({
            error: "No data provided"
        })
    }

    User.findByIdAndUpdate(user_id, req.body)
    .then((result) => {
        res.json({
            detail: "User updated"
        })
    })
    .catch((err) => {
        res.json({
            error: "Invalid ID"
        })
    })
}

module.exports = {
    user_register_post,
    user_login_post,
    user_logout_get,
    user_details_get,
    user_delete,
    user_update_put
}