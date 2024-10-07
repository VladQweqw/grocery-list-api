const Grocery = require('../models/grocery')
const User = require('../models/user')
const Item = require('../models/item')

const { create_items, remove_items } = require('../controllers/itemsController')

function lists_get(req, res) {
    const reverse = Boolean(req.query.reverse);
    if(reverse == 'false') reverse = false;
    
    Grocery.find().populate({
        path: "user",
        select: "nickname email",
        model: User,
    })
    .populate({
        path: "list",
        model: Item
    })
    .then((result) => {
        res.json({
            data: reverse ? result.reverse() : result
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
    
    const grocery_items = {
        title: req.body.title,
        list: [],
        user: req.body.user,
    }
    
    const grocery_list = await Grocery.create(grocery_items)
    await create_items(req.body.list, grocery_list._id)
    
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
    
     Grocery.findById(list_id)
     .populate({
         path: "user",
         select: "nickname email",
         model: User,
     })
     .populate({
        path: "list",
        model: Item
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

async function list_delete_delete(req, res) {
    const list_id = req.params.id

    try {
        await remove_items(list_id)
    }
    catch(err) {
        res.json({
            error: "Invalid ID"
        })
    }

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

async function list_update_put(req, res) {
    const list_id = req.params.id;
    
    if(req.body.length === 0) {
        return res.status(400).json({
            error: "No data provided"
        })
    } 
    
    try {
        const new_list = []
        const grocery_list = await Grocery.findById(list_id);        

        try {
            for(const item of req.body) {
                if(!item.name || typeof(item.isChecked) !== 'boolean') {
                    return res.status(400).json({
                        error: 'Data provided is incorrect'
                    })
                }            
                try {                
                    item.origin_list = list_id;
                    
                    console.log(item, item._id.startsWith('NUL'));
                    if(!item._id || item._id.startsWith('NUL')) {
                        delete item._id;
                        const list_item = await Item.create(item);
                        new_list.push(list_item)
                    }else {
                        try {
                            await Item.findOneAndUpdate({
                                _id: item._id,
                            }, {
                                name: item.name
                            });

                         
                        }
                        catch(err) {                            
                            return res.status(400).json({
                                error: `Invalid item ID / error when Update`
                            })
                        }

                        new_list.push(item._id)
                    }
                }
                catch(err) {
                    return res.status(400).json({
                        error: 'Cannot create item'
                    })
                }
            }    
        }
        catch(err) {
            return res.status(201).json({
                error: `Data must be an array`
            })
        }
        
        try {            
            await grocery_list.updateOne({
                $set: {
                    list: new_list
                }
            })
        }
        catch(err) {
            return res.status(201).json({
                error: `Error when saving content`
            })
        }
    }
    catch(err) {
        return res.status(400).json({
            error: 'Invalid list ID'
        })
    }
    

    return res.status(201).json({
        error: `List has now ${req.body.length} items`
    })
}

async function list_item_check_toggle_put(req, res) {
    const item_id = req.body.item_id
    const state = req.body.state
    
    Item.findByIdAndUpdate(item_id, {isChecked: state})
    .then((result) => {
        res.json({
            detail: `Item updated to ${state}`
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
