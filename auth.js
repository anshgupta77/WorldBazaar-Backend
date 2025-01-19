require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("./connection");
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// const users = [];
const User = require("./models/user")
const sessions = new Set();
// server
// const sessions = new Map();


// app.get("/", authToken, (req, res) =>{
//     // console.log(req.cookies);
//     // const user = req.user;
//     // res.json({message: `helloe!!! ${user.username}`});
//     res.json({message: "Hello world"});
// })

app.get("/admin", (req,res) =>{
    res.json(users);
})

app.post("/register",async (req,res) =>{
    console.log(req.url);
    try{
        const {username, password, email} = req.body;
        console.log(username);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = {username: username, password: hash, email: email};
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({message: "User is created"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }

})

app.post("/login", async (req,res) =>{
    console.log(req.url);
    const {email, password} = req.body;
    // console.log(users)
    const user = await User.findOne({email: email});


    if(!user) {
        return res.status(401).json({message: "Incorrect username"});
    }


    try{
        const isMatched = await bcrypt.compare(password, user.password);
        console.log(isMatched);
        if(!isMatched){
            return res.status(402).json({message: "Password is incorrect"});
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
    // const sessionId = crypto.randomUUID();

    // sessions.set(sessionId, user);
    // res.cookie("sessionId", sessionId);


    const userInfo = {username: user.username};
    // const token_data = {user: userInfo};
    const token = generateToken(userInfo)
    const refresh_token = jwt.sign(userInfo,  process.env.REFRESH_TOKEN_SECRET);
    sessions.add(refresh_token);
    res.status(201).json({token: token, refresh_token: refresh_token});
})

app.post("/token", (req,res) =>{
    const refresh_token = req.body.token;
    if(!sessions.has(refresh_token)) return res.status(500).json({message: "Not authorise"});

    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, function(err, token_data){
        if(err){
            return res.status(500).json({message: "Forbidden", err: err.message});
        }

        // timestamp should be remved so that it will generate new token.
        console.log(token_data);
        const token = generateToken({user: token_data.username});
        return res.json({ new_access_token : token});
    })
})



app.delete("/logout", (req,res) =>{
    // const sessionId = req.cookies.sessionId;// req.user each user have it own req.user.

    // const user = sessions.get(sessionId);
    // if(!user){
    //     return res.json({message: "User already logout"});
    // }


    // sessions.delete(sessionId);
    // console.log(sessionId);
    // res.json({message: ` ${user.username} Logout successfully`});


    const refresh_token = req.body.token;
    console.log(refresh_token);
    if(!sessions.has(refresh_token)){
        return res.status(404).json({message: "dont try again"})
    }
    sessions.delete(refresh_token);
    res.json({message: "Logout successfully"})
})


function generateToken(data){
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
}


app.listen(4070, ()=>{
    console.log("Server is running 4070");
})