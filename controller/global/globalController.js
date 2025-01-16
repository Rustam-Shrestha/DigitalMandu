const Product = require("../../models/productModel");
const Review = require("../../models/reviewModel");


exports.getProducts = async (req, res) => {

    // changed this code first it used to fetch only id
    // but now as we changed the reviewModel to nextWayReviewModel
    // we are changing to fetch data and more data nested inside
    // the nested path as  reviews database selecting name and email of user
    // const products = await Product.find().populate({
    //populate after getting nto the reviews collection and display name and email of the user from reviews colelections 
    // path:"reviews",
    // populate:{
    //     path:"userId",
    //     select:"name email"
    // }
    //above method will populate the user id based way retriving name email of that user

    // });


    //we will be using another method for this just finding not populating
    const products = await Product.find()

    // if products are nto available give message of no products available
    if (products.length == 0) {
        res.status(400).json({
            message: "products not found",
            data: []
        })
    } else {
        res.status(200).json({
            message: "products fetched successfully",
            data: products
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
                data: []
            })
        } else {
            const products = await Product.findById({ _id: id });
            //showing review to the product simultaneously
            const reviews = await Review.find({ productId: id }).populate("userId").populate("productId");
            // if products are nto available give message of no products available
            if (!products) {
                res.status(404).json({
                    message: `Oops the item you searched is not here`,
                    data: []
                })
            } else {
                res.status(200).json({
                    message: "product fetched successfully",
                    data: products,
                    reviews: reviews
                })
            }

            if (products.length == 0) {
                res.status(400).json({
                    message: `produ0cts not found for id ${id}`,
                    data: []
                })
            }
            res.status(200).json({
                message: "products fetched successfully",
                data: products
            })
        }

    } catch (error) {
        const { id } = req.params;
        console.log(error.message)
        res.status(400).json({
            message: `product with  id ${id} not found`,
        })
    }
}
