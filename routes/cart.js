const express = require('express');

const router = express.Router();

const Cart = require("../models/cart");
const {authToken} = require("../middleware/authToken");

router.use(authToken);

router.get("/", async (req, res) =>{
    const cart = await Cart.find()
    console.log(req.url);
    res.json({cart:cart});
})

router.post("/", async (req, res) =>{
    const {id, name, price, image, description} = req.body;
    const cart = new Cart({id, name, price, image, description, quantity: 1, selected: true});
    await cart.save();
    res.json(cart);
})

router.patch("/quantity", async (req, res) =>{
    // const {id, increament} =  req.body;
    // const cart = await Cart.findOne({id: id});
    // cart.quantity = cart.quantity+increament;
    // await cart.save();
    // res.json(cart);
    try{
        const {id, increament} =  req.body;
        const cart = await Cart.findOne({id: id});
        if(!cart){
            return res.status(404).json({message: "Item not found"});
        }
        cart.quantity = cart.quantity+increament;
        await cart.save();
        res.status(200).json({cart});
    }catch(err){    
        console.error("Error Quantity item:", error);
        res.status(500).json({ message: "Server error", error });
    }
})

router.patch("/toggle", async (req, res) =>{
    try{
        const {id} =  req.body;
        const cart = await Cart.findOne({id: id});
        if(!cart){
            return res.status(404).json({message: "Item not found"});
        }
        cart.selected = !cart.selected; 
        await cart.save();
        res.status(200).json({cart});
    }catch(err){
        console.error("Error Toggle item:", error);
        res.status(500).json({ message: "Server error", error });
    }
})

router.delete("/delete", async (req, res) => {
    try {
        const { id } = req.body;

        // Delete the specific item from the cart
        const deletedItem = await Cart.findOneAndDelete({ id: id });

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Fetch the updated cart schema
        const cart = await Cart.find({}); // Adjust filter as needed

        res.status(200).json({cart});
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Server error", error });
    }
});



module.exports = router;