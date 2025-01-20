require("dotenv").config();
const express = require('express');
const app = express();
const PORT = 4000;
// const Cart = require("./models/cart");
// const Product = require("./models/product");
const cors = require("cors");
require("./connection");
app.use(express.json());
app.use(cors());


const cartRouter = require("./routes/cart");
app.use("/cart", cartRouter);


const productRouter = require("./routes/product");
app.use("/product", productRouter);
app.listen(PORT, (req, res) =>{
    console.log(`Index Server is running on port ${PORT}`);
})