let mongoose= require('mongoose')

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/killbacc91903200", { useCreateIndex: true, useNewUrlParser: true });

let UserVisitSchema= new mongoose.Schema({
    datetime: Date
})

module.exports= mongoose.model('user-visit', UserVisitSchema)