let mongoose= require('mongoose')

// const database= 'formUp07022020'
// const user= '127.0.0.1'

// // Setting up mongo database connection
// var mongoDB= `mongodb://${user}/${database}`
// mongoose.connect(mongoDB)

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/killbacc91903200", { useCreateIndex: true, useNewUrlParser: true });

let ProductSchema= new mongoose.Schema({
    categories:{
        category:{
            type: String,
            required: true
        },
        subCategory:{
            type: String,
        },
    },
    currentRating:{
        type: Number,
        default: 0
    },
    ratings:[{
        type: Number,
    }],    
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: [{
        type: String
    }],
    imageIcon: [{
        type: String
    }],
    imageURLs: [{
        type: String
    }],
    name: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required:true
    },
    priceNormal: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number
    },
    reduction: {
        type: Number
    },
    seller: {
        type: String,
        required: true
    }
})

module.exports= mongoose.model('product', ProductSchema   )