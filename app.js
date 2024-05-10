const mongoose = require('mongoose');
const express = require('express')
const groceryRoutes = require('./routes/groceryRoutes')
const userRoutes = require('./routes/userRoutes')

const dbUri = "mongodb+srv://vladpoienariu:A6zPN6fsPpTxRls7@lists.5vhezvm.mongodb.net/grocery-list?retryWrites=true&w=majority&appName=lists";

const app = express()
const PORT = 3000


mongoose.connect(dbUri)
.then((result) => {
    app.listen(PORT)

    console.log(`Succesfully connected to DB`);
})
.catch((err) => {
    console.log(`Error while connecting to DB: ${err}`);
})

app.use(express.static('public'))
app.use(express.json())


app.use('/', groceryRoutes)
app.use('/', userRoutes)
