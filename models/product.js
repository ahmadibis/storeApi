const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now() },
  name: { type: String, required: [true, "product name must be provided"] },
  price: { type: Number, required: [true, "product price must be provided"] },
  company: {
    type: String,
    enum: {
        values: ["ikea", "liddy", "caressa", "marcos"],
        message: '{VALUE} is not supported'
    },
  },
});

module.exports = mongoose.model("Product", ProductSchema);