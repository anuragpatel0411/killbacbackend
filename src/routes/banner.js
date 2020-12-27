let BannerModel= require('./../models/banner.model')
let Token= require('./token')
let express= require('express')
let router= express.Router()

// GET active banner
router.get('/banner/get-active-banner', (req, resp)=>{
    BannerModel.findOne({
        isActive: true
    })
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })

})

// GET all banners
router.get('/banner/get-all-banners', (req, resp)=>{
    BannerModel.find()
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })

})

// add new banner
router.post('/banner/add-banner', async(req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    console.log(Token.getToken())
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    // BannerModel.findOne({
    //     isActive: true
    // })
    //     .then(result=>{
    //         BannerModel.updateOne(
    //             { 
    //                 _id: result._id,
    //             },
    //             {
    //                 $set:{
    //                     isActive: false
    //                 },
    //                 $currentDate: {
    //                     lastModified: true
    //                 }
    //             }
    //         ).then()
    //     })
    let model= new BannerModel(req.body.data)
    model.save()
        .then(data=> {
            if(!data || data.length === 0)
                return resp.status(500).send(data)
            resp.status(201).send("Banner Added Successfully!")
        })
    
        
})

// make banner active
router.post('/banner/activate-banner', async(req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    BannerModel.findOne({
        isActive: true
    })
        .then(result=>{
            BannerModel.updateOne(
                { 
                    _id: result._id,
                },
                {
                    $set:{
                        isActive: false
                    },
                    $currentDate: {
                        lastModified: true
                    }
                }
            ).then()
        })
    BannerModel.updateOne(
        { 
            _id: req.body.data._id,
        },
        {
            $set:{
                isActive: true
            },
            $currentDate: {
                lastModified: true
            }
        })
            .then(doc2=>{
                    resp.status(200).send("Activated")
            }).catch(err=>{
                resp.status(500).json(err)
            })
})


// DELETE Banner
router.delete('/banner/delete-banner/:_id', (req, resp)=>{
    BannerModel.deleteOne({
        _id: req.params._id
    })                              
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })
})


module.exports= router