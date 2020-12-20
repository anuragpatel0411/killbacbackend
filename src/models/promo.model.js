let mongoose= require('mongoose')

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/killbacc91903200", { useCreateIndex: true, useNewUrlParser: true });

let PromoSchema= new mongoose.Schema({
    preHeading: {
        type: String
    },
    heading: {
        type: String,
        reuired: true
    },
    afterHeading: {
        type: String
    },
    image: {
        type: String,
        reuired: true
    },
    buttonText: {
        type: String,
    },
    link: {
        type: String,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
})

module.exports= mongoose.model('promos', PromoSchema)