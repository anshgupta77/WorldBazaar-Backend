
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authToken } = require("../middleware/authToken");

router.use(authToken);

// Middleware to fetch user by email
const getUserByEmail = async (req, res, next) => {
    try {
        // console.log(req.user.email);
        const user = await User.findOne({ email: req.user.email });
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.userDocument = user; 
        // console.log(req.userDocument);// Attach the user document to the request object
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



router.get("/userinfo", async (req, res) => {
    try{
        console.log(req.url);
        const userInfo = req.user;
        console.log(userInfo);
        res.json({user: userInfo});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

router.get("/", async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})


// Get the cart for the logged-in user
router.get("/cart", getUserByEmail, (req, res) => {
    res.json({ cart: req.userDocument.cart });
});

// Add an item to the user's cart
router.post("/cart", getUserByEmail, async (req, res) => {
    try {
        const { id, title, price, oldPrice, description, category, image, rating } = req.body;
        const user = req.userDocument;

        // Check if the item already exists in the cart
        const existingItem = user.cart.find(item => item.id === id);
        if (existingItem) {
            return res.status(400).json({ message: "Item already in cart" });
        }

        user.cart.push({ id, title, price, oldPrice, description, category, image, rating, quantity: 1, selected: true });
        await user.save();
        res.json({ cart: user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update quantity of an item in the user's cart
router.patch("/cart/quantity", getUserByEmail, async (req, res) => {
    console.log(req.url);
    try {
        const { id, increment } = req.body;
        const user = req.userDocument;

        const item = user.cart.find(item => item.id === id);
        console.log(item);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = item.quantity + increment;
        console.log(item);

        if (item.quantity < 1) item.quantity = 1;   // Ensure quantity doesn't go below 1
        await user.save();
        res.json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Toggle the selected status of a cart item
router.patch("/cart/toggle", getUserByEmail, async (req, res) => {
    try {
        const { id } = req.body;
        const user = req.userDocument;

        const item = user.cart.find(item => item.id === id);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.selected = !item.selected;
        await user.save();
        res.json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove an item from the user's cart
router.delete("/cart/delete/:id", getUserByEmail, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = req.userDocument;

        const cartIndex = user.cart.findIndex(item => item.id === id);
        if (cartIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        user.cart.splice(cartIndex, 1);
        await user.save();
        res.json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

