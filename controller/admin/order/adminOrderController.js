const Order = require("../../../models/orderModel")


// getting the orders of user
exports.getAllOrders = async (req, res) => {
    
    const orders = await Order.find().populate({
            path: "items.product",
        model: "Product"
    })
    if(orders.length == 0){

        res.status(404).json({
            message:"no orders",
            data:orders
        })
    }
    res.status(200).json({
        message:"orders fetched successfully",
        data:orders
    })

}
