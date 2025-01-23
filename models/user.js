const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    id: {
      type: Number,
      required: true,
      unique: true, // To ensure each product has a unique ID
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    selected: {
      type: Boolean,  
      default: false,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      rate: {
        type: Number,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  }
);
const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email:{
        type: String,
    },
    password:{
        type: String,
    },
    cart: {
        type: [cartSchema],
        default: [],
    }
})

module.exports = mongoose.model("Users", userSchema, "users");