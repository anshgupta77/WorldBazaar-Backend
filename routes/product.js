const express = require('express');
const router = express.Router();
const Product = require("./../models/project");
const {authToken} = require("../middleware/authToken");
// router.use(authToken);
router.get("/", async (req, res) =>{
    const products = await Product.find()
    console.log(req.url);
    res.json({products:products});
})

router.post("/", async (req, res) =>{
    const {id, title, price, oldPrice, description, category, image, rating} = req.body;
    const product = new Product({id, title, price, oldPrice, description, category, image, rating});
    await product.save();
    res.json(product);
})

module.exports = router;
