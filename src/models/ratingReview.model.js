let mongoose= require('mongoose')

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/killbacc91903200", { useCreateIndex: true, useNewUrlParser: true });

let RatingReviewSchema= new mongoose.Schema({
    name: {
        type: String,
        reuired: true
    },
    email: {
        type: String,
        required: true
    },
    ratingStar: {
        type: Number,
        reuired: true
    },
    review: {
        type: String,
    },
    date: {
        type: Date,
    },
    productId: {
        type: String,
        required: true,
    }
})

module.exports= mongoose.model('ratingreview', RatingReviewSchema)