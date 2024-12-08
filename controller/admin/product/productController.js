const Product = require("../../../models/productModel");

exports.createProduct = ((req, res) => {
    // getting file metadata
    const file = req.file
    // setting default filepath as some image
    let filepath 
    if(!file){
        filepath = "https://artists.spotify.com/songwriter/3IMp1zKhmOEmva4eNPGZKf"
    }else{
// if file exists then give filename as filepath
        filepath = req.file.filename
    }
    try {
        console.log(req.user);
        // return;
        const { userProductName, userProductPrice, userProductDescription, userProductStatus, userProductStock } = req.body;
        // if any of the above information is not provided give 400 status error
        if (!userProductName || !userProductPrice || !userProductDescription || !userProductStatus || !userProductStock) {
            // send 400 status with required product field not filled 
            res.status(400).json({
                message: "given product field must be filled compulsarily"
            })
        }
        // insert to the Products collectionin mongo db 
        Product.create({
            productName: userProductName,
            productPrice: userProductPrice,
            productDescription: userProductDescription,
            productStatus: userProductStatus,
            productStock: userProductStock,
            // setting image as filename
            productImage: filepath,
        })
            .then((product) => {
                res.status(201).json({
                    message: "product created successfully",
                    product: product
                })
            })
    } catch (err) {
        res.status(500).json({
            message: "error occured"
        })

    }


})