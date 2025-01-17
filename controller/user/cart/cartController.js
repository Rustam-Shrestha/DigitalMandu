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

//getting my cart items
exports.getCartItems = async (req, res) => {
    try {
        const userID = req.user.id;
        // get specific user
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        //this code will display user and nested cart having id will be populated
        //as schema is already defined with product name 
        //it will refer to product collection and join the product basically gives
        //all details of product respect to id
        const cartData = await user.populate({
            path: "cart",
            // sleective election deducting only product  status hence status is not shown 
            select: "-productStatus"
        })
        res.status(200).json({
            message: "fetched carted items",
            //this is whole nestd data to limit data we only take nested part alled cart
            data: cartData.cart
        })

        //another way
        // inside that user there is nested cart use that cart that has id
        //then use that id to find the actual product 
        // const cartItems = await Product.find({ _id: { $in: user.cart } });
        // res.status(200).json(cartItems);


    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
}




// edit the cart functionality



//removing element from cart
exports.removeCartItem = async (req, res) => {
    try {
        // Retrieve user ID from token
        const userID = req.user.id;
        // Get cart ID from URL parameter
        const cartID = req.params.cartID;
        // Get specific user
        const user = await User.findById(userID);
        const product = await Product.findById(cartID);
        
        if (!cartID) {
            return res.status(404).json({ msg: "Cart not found" });
        }
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        
        // remove product from cart
        //bsically filter loops inside the cart x being iteration
        //only selects item thatis not cartid
        //basically id is in object form we check it with the cart id string by conveting it to stirng
        // should not use parenthesis in nested function of filter
        //ot it will create error and deletye all the items
        user.cart = user.cart.filter((x) => x.toString() !== cartID);
        await user.save();
        
        res.status(200).json({
            message: "Removed an item from cart"
        });

    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};



// exports.removeCartItem = async (req, res) => {
//     try {
//         // retrive user id from token
//         const userID = req.user.id;
//         // get cart id from url parameter
//         const cartID = req.params.id;
//         // get specific user
//         const user = await User.findById(userID);
//         if (!user) {
//             return res.status(404).json({ msg: "User not found" });
//         }
//         // find the cart item and delete it
//         const cartItem = await Cart.findByIdAndDelete(cartID);
//         if (!cartItem) {
//             return res.status(404).json({ msg: "Cart item not found" });
//         }
//         // update the user's cart
//         user.cart = user.cart.filter((item) => item.toString() !== cartID);
//         await user.save();
//         res.status(200).json({ msg: "Cart item removed" });
//     } catch (error) {
//         res.status(500).json({ msg: "Server error", error: error.message });
//     }
// }
