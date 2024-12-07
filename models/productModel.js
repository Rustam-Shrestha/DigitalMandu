const mongoose = require('mongoose');
// Define the product schema with database fields as phone, name, and email
const productSchema = new mongoose.Schema({
    productName: { type: String, required: [true, "product name is required"] },
    productDescription: { type: String, required: [true, "product description is required"] },
    productStock: { type: Number, required: [true, "product stock is required"] },
    productPrice: { type: Number, required: [true, "product price is required"] },
    productStatus: { type: String, enum: ['draft', 'public'], required: [true, "draft is required"], default: "draft" },
},{
    // enabling mongodb to use new data called timespants
    timestamps:true,
});
// create model named product which is in side param assigns it the model we created above
// and assigns it to product variable
const Product = mongoose.model('Product', productSchema);

// Export the product model
module.exports = Product;