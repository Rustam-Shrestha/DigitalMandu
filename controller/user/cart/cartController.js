const Product = require("../../../models/productModel");
const User = require("../../../models/userModel");

exports.addToCart = async (req, res) => {
    try {
        const userID = req.user.id;
        const { productID } = req.params;

        // Retrieve the product
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        // Retrieve the user
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Add product to cart
        user.cart.push(productID);
        await user.save();

        res.status(200).json({ message: "Product added to cart" });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};



// edit the cart functionality





// remove from cart functionality