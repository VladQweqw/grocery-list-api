const Grocery = require('../models/grocery')
const User = require('../models/user')

const mongoose = require('mongoose')

function lists_get(req, res) {
    Grocery.find().populate({
        path: "user",
        select: "nickname email",
        model: User,
    })
    .then((result) => {
        res.json({
            data: result
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json({
            error: err
        })
    })
}

async function lists_post(req, res) {
    const grocery_list = await Grocery.create(req.body)
    
    await User.findByIdAndUpdate(req.body.user,
       {
          $push: {
             lists: grocery_list._id
          }
       });

    grocery_list.save()
    .then((result) => {
        res.json({
            detail: "List created"
        })
    })
    .catch((err) => {
        res.json({
            error: "Error while adding the post"
        })
    })
}

function list_detail_get(req, res) {
    const list_id = req.params.id
    
    Grocery.findById(list_id)
    .then((result) => {
        res.json({
            data: result
        })
    })
    .catch((err) => {
        res.json({
            error: 'Invalid ID'
        })
    })
}

function list_delete_delete(req, res) {
    const list_id = req.params.id

    Grocery.findByIdAndDelete(list_id)
    .then((result) => {
        res.json({
            detail: "Grocery List deleted"
        })
    })
    .catch((err) => {
        res.json({
            error: "Invalid ID"
        })
    })
}

function list_update_put(req, res) {
    const list_id = req.params.id

    if(Object.keys(req.body).length === 0) {
        res.status(400).json({
            error: 'No data provided'
        })
    } 

    Grocery.findByIdAndUpdate(list_id, req.body)
    .then((result) => {
        res.json({
            detail: "List updated"
        })
    })
    .catch((err) => {
        res.json({
            error: 'Invalid ID'
        })
    })

}

module.exports = {
    lists_get,
    lists_post,
    list_detail_get,
    list_delete_delete,
    list_update_put,
}