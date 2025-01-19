const { default: axios } = require("axios");
const Order = require("../../../models/orderModel");

exports.initateKhaltiPayment = async (req, res) => {
    const { orderId, amount } = req.body;
    if (!orderId || !amount) {
        return res.status(400).json({ message: "Order id and amount are required." });
    }

    const data = {
        return_url: "http://localhost:3000/api/payment/success",
        purchase_order_id: orderId,
        amount: amount * 100, // Convert NPR to paisa
        website_url: "http://localhost:3000/",
        purchase_order_name: "order_name_" + orderId
    };

    try {
        const response = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", data, {
            headers: {
                "Authorization": "key 370da36237d94394a497c6d83e634229",
                "Content-Type": "application/json"
            }
        });

        console.log("response", response.data);
        let  order = Order.findById(orderId)
        order.paymentDetails.pidx = response.data.pidx
        await order.save()
        // this will redirect to the pyayment page with or merchant accout to accept payment and 
        //filled with all the credentials also giving transactionID too
        res.redirect(response.data.payment_url);
    } catch (error) {
        console.error("Error initiating payment:", error.response ? error.response.data : error.message);
        res.status(400).json({ message: "Failed to initiate payment", error: error.response ? error.response.data : error.message });
    }
};

// verifying transaction id pids
//verifying payment is done or not 
exports.verifyPidx = async (req, res) => {
    //pidx comes from qyery not params as it is followed as ?pidx=xxx
    const pidx = req.query.pidx;
    if (!pidx) {
        return res.status(400).json({ message: "Pidx is required." });
    }
    //using axios request to lookup at the payment status that will show 
    //trabsatction id payment amount and status of payment
    const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/", { pidx: pidx }, {
        //headers should be also given to authorize the token if we are initializing the right request or not 
        //otherwise we will be unauthorixed
        headers: {
            "Authorization": "key 370da36237d94394a497c6d83e634229",
            "Content-Type": "application/json"
        }
    }
    );
    console.log(response.data.pidx)
    res.send(response.data)
    if (response.data.status == "Completed") {
        //modify database   
        let order =await Order.find({"paymentDetails.pidx":pidx})
        console.log(order)
        order[0].paymentDetails.metnod = "khalti"
        order[0].paymentDetails.status = "paid"
        await order.save()
        //notify the user that payment is done
        res.redirect("http://localhost:3000")
    } else {
        //notify the user that payment is not done
        res.redirect("http://localhost:3000/failurePage")
    }
}