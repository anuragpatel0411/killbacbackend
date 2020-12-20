let mongoose= require('mongoose')

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/killbacc91903200", { useCreateIndex: true, useNewUrlParser: true });

let CategorySchema= new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    subCategory: [{
        type: String
    }]
})

module.exports= mongoose.model('category', CategorySchema)