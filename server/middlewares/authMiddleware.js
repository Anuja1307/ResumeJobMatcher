const jwt=require('jsonwebtoken');
const User=require('../models/user');

const protect=(req,res,next)=>{
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).send("Unauthorized no token provided");
}
    const token = auth.split(" ")[1];
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch{
        return res.status(401).send("Unauthorized token not valid");
    }

}
module.exports=protect;

