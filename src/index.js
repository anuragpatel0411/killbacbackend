let express = require('express')
let app = express()

let admin= require('./routes/admin')
let product= require('./routes/products')
let category= require('./routes/category')
let promo= require('./routes/promo')
let banner= require('./routes/banner')
let user= require('./routes/userMessage')
let fileUploadDelete= require('./routes/file-upload-delete')


let path= require('path')
let bodyParser = require('body-parser')

// --------------------------------------------------------------------------------------------------------------------------------------------------------
//request headers
app.use(function(req, resp, next) {
    console.log("allowed")
    resp.header("Access-Control-Allow-Origin", "*")
    resp.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});
// --------------------------------------------------------------------------------------------------------------------------------------------------------

app.use(bodyParser.json())
app.use((req, resp, next) =>{
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
    // resp.send('')
    next()
})

// for images path
app.use(express.static(__dirname + './../uploads'));

app.use(admin)
app.use(product)
app.use(category)
app.use(promo)
app.use(banner)
app.use(user)
app.use(fileUploadDelete)

app.use(express.static('public'))

//404 Not found Error Handler
app.use((req, resp) =>{
    resp.status(404).send('You are lost by- 404!')
})

//500 Error Handler
app.use((err, req, resp, next)=>{
    console.log(err.stack)
    resp.sendFile(path.join(__dirname, '../public/500.html'))
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.info(`Server Has Started on ${PORT}`))