const jwt = require("jsonwebtoken");
function authToken(req, res, next){
    // console.log(req.headers);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("Token",token);

    if(!token){
        return res.status(500).json({message: "Not authorise"});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, token_data){
        if(err){
            return res.status(500).json({message: "Forbidden"});
        }
        // userinfo.iat
        req.user = token_data.user;
        next();
    })
}
module.exports = {
    authToken,
    
}