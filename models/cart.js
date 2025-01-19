const mongoose = require("mongoose");

// Define the Cart Schema
const cartSchema = new mongoose.Schema({
  

    
      id: {
        type:String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1, // Default quantity is 1
        min: 1,
      },
      selected:{
        type: Boolean,
        default: true,
      }
    },


);

module.exports = mongoose.model("Cart", cartSchema, "cart");
