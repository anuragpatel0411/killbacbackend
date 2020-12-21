let express= require('express')
let router= express.Router()
var fs = require('fs');

let multer= require('multer')
const path = require('path');

// ===============================================================================================================
// ===============================================================================================================
// Product File APIs
// ===============================================================================================================
// ===============================================================================================================

const storageProdImages = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/products/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

router.post('/files/upload-product-images', (req, resp) => {

    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storageProdImages }).array('product', 5);

    upload(req, resp, function(err) {

        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        var fileNames= [];
        req.files.forEach((item)=>{  
            fileNames.push(item.filename)
        })
        console.log(fileNames)
        if (req.fileValidationError) {
            return resp.send(req.fileValidationError);
        }
        // else if (!req.file) {
        //     console.log("b")

        //     return resp.send('Please select an image to upload');
        // }
        else if (err instanceof multer.MulterError) {
            return resp.send(err);
        }
        else if (err) {
            return resp.send(err);
        }else
        // Display uploaded image for user validation
        return resp.send(fileNames);
    });
});


// ===============================================================================================================
// ===============================================================================================================
// Banner File APIs
// ===============================================================================================================
// ===============================================================================================================

const storageBannerImage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, 'uploads/banners/'));
        // cb(null, 'uploads/banners/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

router.post('/files/upload-banner-image', (req, resp) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storageBannerImage }).single('banner');

    upload(req, resp, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        if (req.fileValidationError) {
            return resp.send(req.fileValidationError);
        }
        // else if (!req.file) {
        //     console.log("b")

        //     return resp.send('Please select an image to upload');
        // }
        else if (err instanceof multer.MulterError) {
            return resp.send(err);
        }
        else if (err) {
            return resp.send(err);
        }else
        // Display uploaded image for user validation
        return resp.send(req.file.filename);
    });
});

// ===============================================================================================================
// ===============================================================================================================
// Promo File APIs
// ===============================================================================================================
// ===============================================================================================================


const storagePromoImages = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/promos/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

router.post('/files/upload-promo-image', (req, resp) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storagePromoImages }).single('promoBanner');

    upload(req, resp, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        if (req.fileValidationError) {
            return resp.send(req.fileValidationError);
        }
        // else if (!req.file) {
        //     console.log("b")

        //     return resp.send('Please select an image to upload');
        // }
        else if (err instanceof multer.MulterError) {
            return resp.send(err);
        }
        else if (err) {
            return resp.send(err);
        }else
        // Display uploaded image for user validation
        return resp.send(req.file.filename);
    });
});


// ===============================================================================================================
// ===============================================================================================================
// Delete File APIs
// ===============================================================================================================
// ===============================================================================================================



router.post('/files/delete-files', (req, resp) => {
    let location= "";
    if(req.body.type== 'product'){
        location= "./uploads/products/";
        
        function deleteFiles(files, callback){
            var i = files.length;
            files.forEach(function(filepath){
                fs.unlink(location+filepath, function(err) {
                    i--;
                    if (err) {
                        callback(err);
                        return;
                    } else if (i <= 0) {
                        callback(null);
                    }
                });
            });
        }

        deleteFiles(req.body.data, function(err) {
            if (err) {
                resp.status(200).send(err)
            } else {
                resp.status(200).send('deleted')
            }
        });
    }

    if(req.body.type== 'promo'){
        location= "./uploads/promos/";
        fs.unlink(location+req.body.data.fileName, function (err) {
            if (err) resp.status(200).send(err)
            // if no error, file has been deleted successfully
            else resp.status(200).send('deleted')
        }); 
    }


    if(req.body.type== 'banner'){
        location= "./uploads/banners/";
        fs.unlink(location+req.body.data.fileName, function (err) {
            if (err) resp.status(200).send(err)
            // if no error, file has been deleted successfully
            else resp.status(200).send('deleted')
        }); 
    }

});

module.exports= router