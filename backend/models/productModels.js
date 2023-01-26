const { default: mongoose } = require("mongoose");

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    sku: {
        type: String,
        required: true,
        default:"SKU",
        trim:true,
    },
    category: {
        type: String,
        required: [true, "Please add a category"],
    },
    quantity: {
        type: String,
        required: [true, "Please add a quantity"],
    },
    price: {
        type: String,
        required: [true, "Please add a price"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
    },
    image: {
        type: Object,
        default: {},
    },
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;