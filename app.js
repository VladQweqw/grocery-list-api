const mongoose = require('mongoose');
const express = require('express')
const groceryRoutes = require('./routes/groceryRoutes')
const userRoutes = require('./routes/userRoutes')

const cors = require('cors')

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

const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://192.168.1.69:3000',
        'http://192.168.1.69:3001'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': true,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
}



app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())

app.get('*', cors(corsOptions))
app.post('*', cors(corsOptions))


app.use('/', groceryRoutes)
app.use('/', userRoutes)
