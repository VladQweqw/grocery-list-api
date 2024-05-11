const User = require('../models/user')
const GroceryList = require('../models/grocery')

function handleErrors(err) {
    const errors = { email: "", password: "" }

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

function user_login_post(req, res) {
    
}

function user_logout(req, res) {
    
}

function user_details_get(req, res) {
    const user_id = req.params.id
    
    User.findById(user_id).populate({
        path: "lists",
        model: GroceryList,
        strictPopulate: false,
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
    user_logout,
    user_details_get,
    user_delete,
    user_update_put
}