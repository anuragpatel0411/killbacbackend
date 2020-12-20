let PromoModel= require('./../models/promo.model')
let Token= require('./token')
let express= require('express')
let router= express.Router()

// GET active promo
router.get('/promo/get-active-promo', (req, resp)=>{
    PromoModel.findOne({
        isActive: true
    })
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })

})

// GET all promos
router.get('/promo/get-all-promos', (req, resp)=>{
    PromoModel.find({})
        .then(doc=>{
            resp.json(doc)
        }) 
        .catch(err=>{
            resp.status(500).json(err)
        })

})

// add new promo
router.post('/promo/add-promo', async(req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    console.log(Token.getToken())
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    // PromoModel.findOne({
    //     isActive: true
    // })
    //     .then(result=>{
    //         PromoModel.updateOne(
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
    let model= new PromoModel(req.body.data)
    model.save()
        .then(data=> {
            if(!data || data.length === 0)
                return resp.status(500).send(data)
            resp.status(201).send("Promo Added Successfully!")
        })
    
        
})

// make promo active
router.post('/promo/activate-promo', async(req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    PromoModel.findOne({
        isActive: true
    })
        .then(result=>{
            PromoModel.updateOne(
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
    PromoModel.updateOne(
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


// DELETE PROMO
router.delete('/promo/delete-promo/:_id', (req, resp)=>{
    PromoModel.deleteOne({
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