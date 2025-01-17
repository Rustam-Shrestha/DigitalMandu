const Order = require("../../../models/orderModel")

exports.createOrder = async (req, res) => {
    const userId = req.user.id
    // single level non nested type
    // meaning the payment details will nest two things type and status of payment
    //but due to schema having that structurre so no need for more nested
    // operations
    const { shippingAddress, items, totalAmount, paymentDetails } = req.body
    //if either of them is not given showing error message
    if (!shippingAddress || items < 1 || !totalAmount || !paymentDetails) {
        return res.status(400).json({ message: "Please fill all the fields." })
    }
    //if the data are present then populating the orders collection
    await Order.create({
        user: userId,
        shippingAddress,
        items,
        totalAmount,
        paymentDetails
    })
    res.status(200).json({ message: "Order created successfully" })

}

// getting the orders of user
exports.getOrders = async (req, res) => {
    const userId = req.user.id
    if (!userId) [
        res.status(400).json({ message: "Please login to view orders" })
    ]
    const orders = await Order.find({ user: userId }).populate({
        path: "items.product",
        model: "Product",
        select: "-productStock -reviews"
    })
    if (orders.length == 0) {

        res.status(404).json({
            message: "no orders",
            data: orders
        })
    }
    res.status(200).json({
        message: "orders fetched successfully",
        data: orders
    })

}
