let express= require('express')
let router= express.Router()
let ProductsModel= require('./../models/products.model')
let RatingReviewModel= require('./../models/ratingReview.model')
let CategoryModel= require('./../models/category.model')
let PromoModel= require('./../models/promo.model')
let UserMessageModel= require('./../models/userMessage.model')
let UserVisitModel= require('./../models/userVisit.model')
let BannerModel= require('./../models/banner.model')


// DELETE Banner
router.get('/clean/delete-all', (req, resp)=>{
    BannerModel.remove()                              
        .then(doc=>{
            UserVisitModel.remove()                              
            .then(doc=>{
                UserMessageModel.remove()                              
                .then(doc=>{
                    UserVisitModel.remove()                              
                    .then(doc=>{
                        PromoModel.remove()                              
                        .then(doc=>{
                            ProductsModel.remove()                              
                            .then(doc=>{
                                CategoryModel.remove()                              
                                .then(doc=>{
                                    RatingReviewModel.remove()                              
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
                            .catch(err=>{
                                resp.status(500).json(err)
                            })
                        }) 
                        .catch(err=>{
                            resp.status(500).json(err)
                        })
                    }) 
                    .catch(err=>{
                        resp.status(500).json(err)
                    })
                }) 
                .catch(err=>{
                    resp.status(500).json(err)
                })
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