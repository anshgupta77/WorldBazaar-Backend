const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {authToken} = require("../middleware/authToken");
router.use(authToken)

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

module.exports = router;
