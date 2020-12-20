let mongoose= require('mongoose')

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/killbacc91903200", { useCreateIndex: true, useNewUrlParser: true });

let BannerSchema= new mongoose.Schema({
    image: {
        type: String,
        reuired: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
})

module.exports= mongoose.model('banners', BannerSchema)