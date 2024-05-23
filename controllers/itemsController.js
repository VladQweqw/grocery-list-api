const Item = require('../models/item')
const Grocery = require('../models/grocery')

async function create_items(data, list_id) {
    if(data.length === 0) return []
    
    data.forEach(async (item) => {
        item.origin_list = list_id
        const list_item = await Item.create(item)

        try {
            await Grocery.findByIdAndUpdate(list_id,
                {
                    $push: {
                        list: list_item._id
                    }
                });
            }
            catch(err) {
                res.json({
                'error': "Invalid listID"
            })
        }
    })
}

async function remove_items(list_id) {
    const groc_list = await Grocery.findById(list_id)

    groc_list.list.forEach(async(list) => {
        await Item.findByIdAndDelete(list._id)
    })

}

module.exports = {
    create_items,
    remove_items,
}