let ProductModel= require('./../models/products.model')
let CategoryModel= require('./../models/category.model')
let Token= require('./token')
let express= require('express')
let router= express.Router()

// GET CATEGORIES LIST
router.get('/category/get-categories', (req, resp)=>{
    CategoryModel.find()                              
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})


// ADD NEW CATEGORY
router.post('/category/add-category', async(req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    let cat = await CategoryModel.findOne({category: req.body.data.category});
    if(cat) {
        return resp.status(201).send('Category already exists!');
    }
    console.log(req.body.data)
    let model= new CategoryModel(req.body.data)
    model.save()
        .then(data=> {
            if(!data || data.length === 0)
                return resp.status(500).send(data)
            resp.status(201).send("Category Added Successfully!")
        })
        .catch(err=>{
            resp.status(500).json(err)
        }) 
})

// delete CATEGORY
router.delete('/category/delete-category/:_id', (req, resp)=>{
    CategoryModel.findOne({
        _id: req.params._id
    }).then(docs=>{
        ProductModel.find({
            "categories.category": docs.category
        },{
            _id: 1
        })
            .then(doc=>{
                for(let data of doc){
    
                    ProductModel.updateOne(
                        { 
                            _id: data._id,
                        },
                        {
                            $set:{
                                "categories.category": "other",
                                "categories.subCategory": "" 
                            },
                            $currentDate: {
                                lastModified: true
                            }
                        }
                    ).then(doc2=>{
                        console.log("updated")
                    }).catch(err=>{
                        resp.status(500).json(err)
                    })
                }
            })
            .catch(err=>{
                resp.status(500).json(err)
            })
            CategoryModel.deleteOne({
                _id: req.params._id
            })                              
                .then(doc=>{
                    resp.json(doc)
                }) 
                .catch(err=>{
                    resp.status(500).json(err)
                })
    })
    .catch(err=>{
        resp.status(500).json(err)
    })


})


module.exports= router