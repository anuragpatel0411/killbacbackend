let ProductModel= require('./../models/products.model')
let CategoryModel= require('./../models/category.model')
let UserVisitModel= require('./../models/userVisit.model')
let express= require('express')
let router= express.Router()
let Token= require('./token')

// login admin
router.post('/admin/admin-login', (req, resp)=>{
    var today = new Date();
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    if(req.body.data.email == "masteradmin@killbacc.com" && req.body.data.password == "M@sterAdmin#18"){
        return resp.status(201).send("adminlogintoken:"+today.getFullYear()+(today.getMonth()+1)+today.getDate())
    }else{
        return resp.status(201).send('Wrong Credentials')
    }
})

// GET product count
router.get('/admin/get-product-count', (req, resp)=>{
    ProductModel.count()
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

// GET category count
router.get('/admin/get-category-count', (req, resp)=>{
    CategoryModel.count()
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

// Set user visit count
router.post('/admin/set-user-count', (req, resp)=>{

    let model= new UserVisitModel(req.body)

    model.save()
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

// GET total user visit count
router.get('/admin/get-total-user-count', (req, resp)=>{
    UserVisitModel.count()
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

// GET monthly user visit count
router.get('/admin/get-monthly-user-count', (req, resp)=>{
    UserVisitModel.count()
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

module.exports= router