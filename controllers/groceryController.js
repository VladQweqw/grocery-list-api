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
        res.status(400).json({
            error: err
        })
    })
}

async function lists_post(req, res) {
    const grocery_list = await Grocery.create(req.body)
    
    if(!req.body.user) {
        res.json({
            'error': "Invalid userID"
        })
    }

    try {
        await User.findByIdAndUpdate(req.body.user,
       {
          $push: {
            lists: grocery_list._id
          }
       });
    }
    catch(err) {
        res.json({
            'error': "Invalid userID"
        })
    }


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
    
    Grocery.findById(list_id).populate({
        path: "user",
        select: "nickname email",
        model: User,
    })
    .then((result) => {
        console.log(result);
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

async function list_item_check_toggle_put(req, res) {
    const list_id = req.body.list_id
    const item_id = req.body.item_id
    const state = req.body.state
    
    Grocery.findById(list_id)
    .then((result) => {
        const list_item = result.list.find((item) => item._id.toString() === item_id);
        list_item.isChecked = state

        Grocery.findByIdAndUpdate(list_id, result)
        .then((result) => {
            res.json({
                detail: `List item updated to ${state}`
            })
        })
        .catch((err) => {
            res.json({
                error: "Invalid list ID"
            })
        })    

    })
    .catch((err) => {
        res.json({
            error: 'Invalid item ID'
        })
    })
}

module.exports = {
    lists_get,
    lists_post,
    list_detail_get,
    list_delete_delete,
    list_update_put,
    list_item_check_toggle_put
}