// const Review = require("../../models/reviewModel");
const Review = require("../../models/nextWayReviewModel");
const Product = require("../../models/productModel");
const User = require("../../models/userModel");

// instead of this next method is used it is at the bottom check out
// not implemented this code
exports.createReview = async (req, res) => {
    try {
        const id = req.user.id;
        if (!id) {
            return res.status(400).json({
                message: "User with that specific id is not found in database"
            });
        }

        const { userRating, userMessage } = req.body;
        // getting product whaere user is going to reveiw
        const reviewProductId = req.params.id;

        if (!reviewProductId) {
            return res.status(400).json({
                message: "Product id is required"
            });
        }

        if (!userRating || !userMessage) {
            return res.status(400).json({
                message: "Provide the review data to leave a review"
            });
        }

        const productExists = await Product.findById(reviewProductId);
        if (!productExists) {
            return res.status(400).json({
                message: "The product with that id is not found in database"
            });
        }
        // creatign generic review given by user
        await Review.create({
            userId: id,
            productId: reviewProductId,
            rating: userRating,
            message: userMessage
        });

        res.status(200).json({
            message: "Review posted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating review",
            error: error.message
        });
    }
};

exports.getProductReview = async (req, res) => {
    try {
        const reviewProductId = req.params.id;
        if (!reviewProductId) {
            return res.status(400).json({
                message: "Product id is required"
            });
        }

        const productExists = await Product.findById(reviewProductId);
        if (!productExists) {
            return res.status(400).json({
                message: "Product not found"
            });
        }

        // populate is like inner or natural join in  sql here we are joining table with userid
        const reviewsGotten = await Review.find({ productId: reviewProductId }).populate("userId");
        res.status(200).json({
            message: "Review fetched successfully",
            reviews: reviewsGotten
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching reviews",
            error: error.message
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        if (!reviewId) {
            return res.status(400).json({
                message: "The id is to be provided"
            });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        await Review.findByIdAndDelete(reviewId);
        res.status(200).json({
            message: "Deleted a review successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting review",
            error: error.message
        });
    }
};


// instead of create review we used addProductReview as next way of populating the review

exports.addProductReview = async (req, res) => {
    try {
        // retriving everything
        // getting product id from addressbar
        const productId = req.params.id;
        // destructuring the user input
        const { userRating, userMessage } = req.body;
        // getting user id by decoding the jWT token and retrivingt id from object it reuturn
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                message: "Product id is required"
            });
        }

        if (!userRating || !userMessage) {
            return res.status(400).json({
                message: "Provide the review data to leave a review"
            });
        }


        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(400).json({
                message: "The product with that id is not found in database"
            });
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(400).json({
                message: "User not found in database"
            });
        }
        // making review object so we can use it anywhere
        const review = {
            userId: userId,
            message: userMessage,
            rating: userRating,
        };

        // pushing it in reviews

    //productImage: { type: String,required: [true, "image is required"], default: "drafthttps://artists.spotify.com/songwriter/3IMp1zKhmOEmva4eNPGZKf" },
    // // this contsins aray of object which later is going to be populated by .push method while creating a reviwe
    // reviews:[reviewSchema]
    // see the reviews: above with taking array of review Schema
    // pushing the review on the product and saving it 
        productExists.reviews.push(review);
        await productExists.save();

        res.status(200).json({
            message: "Review added successfully",
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            message: "Error adding review",
            error: error.message
        });
    }
};