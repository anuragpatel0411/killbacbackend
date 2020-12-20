let mongoose= require('mongoose')

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/killbacc91903200", { useCreateIndex: true, useNewUrlParser: true });

let UserMessageSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    replied: {
        type: Boolean,
        default: false
    },
    reply: {
        type: String,
    },
    replyDateTime: {
        type: Date,
    },
})

module.exports= mongoose.model('UserMessage', UserMessageSchema)