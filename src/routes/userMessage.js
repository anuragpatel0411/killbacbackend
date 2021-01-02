let UserMessageModel= require('./../models/userMessage.model')
let Token= require('./token')
let express= require('express')
let email= require('./email')
let router= express.Router()

// GET all user-messages    
router.get('/user-message/get-user-message/:opt', (req, resp)=>{            // get 12message at a time
    var noOfMessages= 12;
    var minRange= (req.params.opt* noOfMessages)-(noOfMessages);
    var limit= noOfMessages;

    UserMessageModel.find()
        .sort({"dateTime":-1})
        .skip(minRange)
        .limit(limit)
            .then(doc=>{
                resp.json(doc)
            }) 
            .catch(err=>{
                resp.status(500).json(err)
            })
})

// add new user-message
router.post('/user-message/send-user-message', async(req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    console.log(Token.getToken())
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    let model= new UserMessageModel(req.body.data)
    model.save()
        .then(data=> {
            var reqData= {
                'from': req.body.message.email,
                'to': 'contactkillbacc@gmail.com',
                'subject': `KILLBACC - Query: ${req.body.message.subject}`,
                'body': `<div style="text-align:left;width:90vw;max-width:600px;margin:0 auto;padding:20px;padding:15px;
                    border-radius:15px;border:1px solid #ecb13080;background-color:#ecb1301a;"><h1 
                    style="color:#ecb130;font-weight:600;margin:0;text-align:center;">KillBacc</h1>
                    <div class="msgDetail"><div style="font-size:14px;line-height:14px;"><span>
                    <b>Subject:</b>${req.body.message.subject}</span></div></div><div style="margin:10px 0;
                    padding:10px;background-color:#fff;border-radius:15px;font-size:14px;">
                    <div style="border-bottom:1px solid#cecece;margin-bottom:10px;padding-bottom:10px;">
                    <b>YourMessage: </b>${req.body.message.message}</div></div></div>`
            }
        
            email.sendEmail(reqData)

            if(!data || data.length === 0)
                return resp.status(500).send(data)
            resp.status(201).send("Message Sent Successfully.!")
        })        
})


// add new user-message
router.post('/user-message/send-user-reply', async(req, resp)=>{
    if(!req.body.token){
        return resp.status(500).send('Parameter Missing!')
    }
    console.log(Token.getToken())
    if(req.body.token != Token.getToken()){
        return resp.status(201).send('Something Went Wrong, Please Try again!')
    }
    var reqData= {
        'from': 'contactkillbacc@gmail.com',
        'to': req.body.message.email,
        'subject': `KILLBACC - Reply to: ${req.body.message.subject}`,
        'body': `<div style="text-align:left;width:90vw;max-width:600px;margin:0 auto;padding:20px;padding:15px;
            border-radius:15px;border:1px solid #ecb13080;background-color:#ecb1301a;"><h1 
            style="color:#ecb130;font-weight:600;margin:0;text-align:center;">KillBacc</h1>
            <div class="msgDetail"><div style="font-size:14px;line-height:14px;"><span>
            <b>Subject:</b>${req.body.message.subject}</span></div></div><div style="margin:10px 0;
            padding:10px;background-color:#fff;border-radius:15px;font-size:14px;">
            <div style="border-bottom:1px solid#cecece;margin-bottom:10px;padding-bottom:10px;">
            <b>YourMessage: </b>${req.body.message.message}</div><div class="reply"><b>Reply: 
            </b>${req.body.data.reply}</div></div></div>`
    }

    email.sendEmail(reqData)

    UserMessageModel.updateOne(
        { 
            _id: req.body.message._id,
        },
        {
            $set:{
                replied: true,
                reply: req.body.data.reply,
                replyDateTime: req.body.data.dateTime
            },
            $currentDate: {
                lastModified: true
            }
        }
    ).then()
    resp.status(200).send("Messae-Sent on mail");  
    
})

// DELETE user message
router.delete('/user-message/delete-user-message/:_id', (req, resp)=>{
    UserMessageModel.deleteOne({
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