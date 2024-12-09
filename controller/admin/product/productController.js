const Product = require("../../../models/productModel");
// Include .env to access environment variables
require('dotenv').config();

exports.createProduct = ((req, res) => {
    try {
        // getting file metadata
        const file = req.file
        // setting default filepath as some image
        let filepath
        if (!file) {
            filepath = "https://artists.spotify.com/songwriter/3IMp1zKhmOEmva4eNPGZKf"
        } else {
            // if file exists then give filename as filepath
            filepath = process.env.DOMAIN + ":" + process.env.PORT + "/" + req.file.filename
        }
        console.log(file)
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
        console.log(err.message)
        res.status(500).json({
            message: "Something went wrong"
        })

    }


})
exports.getProducts = async (req, res) => {
    const products = await Product.find();
    // if products are nto available give message of no products available
    if (products.length == 0) {
        res.status(400).json({
            message: "products not found",
            products: []
        })
    } else {
        res.status(200).json({
            message: "products fetched successfully",
            products: products
        })
    }

}
exports.getEachProducts = async (req, res) => {
    try {

        // taking get request destructureing id from URL 
        const { id } = req.params;
        // if products are nto available give message of no products available
        if (!id) {
            res.status(404).json({
                message: `Oops the item you searched is not here`,
                products: []
            })
        } else {
            const products = await Product.findById({ _id: id });
            if (products.length == 0) {
                res.status(400).json({
                    message: `products not found for id ${id}`,
                    products: []
                })
            }
            res.status(200).json({
                message: "products fetched successfully",
                products: products
            })
        }

    } catch (error) {
        const { id } = req.params;
        console.log(error.message)
        res.status(400).json({
            message:`product with  id ${id} not found`,
        })
    }
}

exports.deleteProduct = async (req,res)=>{
    const {id} = req.params
    if(!id){
        return res.status(400).json({
            message:"provide the ID"
        })
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({
        message:`deleted product with id ${id} successfully`
    })
}
exports.updateProduct = async (req,res)=>{
    const {id} = req.params
    if(!id){
        return res.status(400).json({
            message:"provide the ID"
        })
    }
    if(!updatedUserProductName||!updatedUserProductPrice|| !updatedUserProductDescription|| !updatedUserProductStatus|| !updatedUserProductStock){
        return res.status(400).json({
            message:"please provide the information all of them are required"
    })
    // Product.create({
    //     productName: updatedUserProductName,
    //     productPrice: updatedUserProductPrice,
    //     productDescription: updatedUserProductDescription,
    //     productStatus:updatedUserProductStatus,
    //     productStock: updatedUserProductStock,
    //     // setting image as filename
    //     productImage: filepath,
    // })
    // await Product.findByIdAndUpdate(id);
}
}