let ProductsModel= require('./../models/products.model')
let RatingReviewModel= require('./../models/ratingReview.model')
let Token= require('./token')
let express= require('express')
let router= express.Router()

// GET Products List
router.get('/products/get-products', (req, resp)=>{
    console.log(Token.getToken())
    ProductsModel.find().sort({"date":-1})                             
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

// GET Product Names for search
router.get('/products/get-product-names', (req, resp)=>{
    ProductsModel.find()                            
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

// GET top 3 new arrivals products
router.get('/products/get-products-new', (req, resp)=>{
    ProductsModel.find().sort({"date":-1}).limit(3)                           
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

// GET top 3 heavy discount products for sale
router.get('/products/get-products-on-sale', (req, resp)=>{
    ProductsModel.find().sort({"reduction":-1}).limit(3)
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

// GET top 3 best rated products
router.get('/products/get-products-best-rated', (req, resp)=>{
    ProductsModel.find().sort({"currentRating":-1}).limit(3)
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

// GET Product Details
router.get('/product/:_id', (req, resp)=>{
    if(!req.params){
        return resp.status(400).send('Parameters are missing..!')
    }
    ProductsModel.findOne({
        _id: req.params._id
    })                              
    .then(product=>{
        resp.json(product)
    }) 
    .catch(err=>{
        resp.status(200).json(null)
    })
})

// add new product
router.post('/products/add-product', async(req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    let model= new ProductsModel(req.body.data)
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

// DELETE PRODUCT
router.delete('/product/delete-product/:_id', (req, resp)=>{
    ProductsModel.deleteOne({
        _id: req.params._id
    })                              
        .then(doc=>{
            RatingReviewModel.deleteMany({
                productId: req.params._id
            }).then(doc=>{
                resp.json(doc)
            }).catch(err=>{
                resp.status(500).json(err)
            })
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})


// produc names for delete category
router.get('/products/get-product-names/:cat_name', (req, resp)=>{
    ProductsModel.find({
        "categories.category": req.params.cat_name
    },
    {
        name: 1,
        _id: 0
    })                            
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})

//update product
router.post('/products/update-product', (req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    console.log(req.body.data)
    
    ProductsModel.updateOne(
        { 
            _id: req.body._id,
        },
        {
            $set:{
                price: req.body.data.currentPrice,
                priceNormal: req.body.data.priceNormal,
                name: req.body.data.name,
                description: req.body.data.description,
                features: req.body.data.features,
            },
            $currentDate: {
                lastModified: true
            }
        }
    ).then(
        resp.status(200).send("Product updated.!")
    ).catch(err=>{
        resp.status(200).send("Product update fail, Please try again.!")
    })
})


//rate product
router.post('/products/rate-product', async(req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    let rating = await RatingReviewModel.findOne({ 
        productId: req.body.data.productId,  
        email: req.body.data.email
    });
    if (rating) {
        return resp.status(201).send('You have already rated this product.');
    }else{
        let model= new RatingReviewModel(req.body.data)
        model.save()
            .then(
                ProductsModel.findOne({_id: req.body.data.productId})
                    .then(product=>{
                        var ratingArray= product.ratings;
                        ratingArray.push(req.body.data.ratingStar)
                        var currentRate= product.currentRating + ( (req.body.data.ratingStar- product.currentRating)/(product.ratings.length) )
                        ProductsModel.updateOne(
                            { 
                                _id: req.body.data.productId,
                            },
                            {
                                $set:{
                                    currentRating: currentRate,
                                },
                                $push:{
                                    ratings: req.body.data.ratingStar
                                },
                                $currentDate: {
                                    lastModified: true
                                }
                            })
                            .then(data=>{
                                console.log("rated")
                                resp.status(200).send("Review Saved Successfully.!")
                            }).catch(err=>{
                                console.log(err)
                                resp.status(200).send("Product rating fail, Please try again..!")
                            })
                    }).catch(err=>{
                        resp.status(200).send("Product rating fail, Please try again.!")
                    }),
            ).catch(err=>{
                resp.status(200).send("Product rating fail, Please try again.!")
            })
    }
})

// GET Product reviews
router.get('/product/get-product-reviews/:_id', (req, resp)=>{
    if(!req.params){
        return resp.status(400).send('Parameters are missing..!')
    }
    RatingReviewModel.find({
        productId: req.params._id,
        review: { $ne : null }
    })                              
    .then(reviews=>{
        resp.json(reviews)
    }) 
    .catch(err=>{
        resp.status(200).json(null)
    })
})


module.exports= router