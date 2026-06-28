const bcrypt=require('bcrypt');
const User=require('../models/user');
const jwt=require('jsonwebtoken');

exports.dummFunction = (req,res)=>{
    res.send("Inside authController");
}

exports.postRegister=async(req,res)=>{
    console.log("Inside postRegister");
    console.log(req.body);
    
    try{
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;

        if(!name||!email||!password){
            return res.status(400).send("All fields are required");
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).send("User already exists");
        }
        const user=new User({name,email,password:hashedPassword});
        await user.save();
        return res.status(201).send("User registered successfully");
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Server error");
    }
}

exports.postLogin=async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    if(!email || !password){
        return res.status(400).send("All fields are reuired");
    }

    const userExists=await User.findOne({email});

    if(!userExists){
        return res.status(400).send("User does not exist");
    }

    const isMatch=await bcrypt.compare(password,userExists.password);
    if(!isMatch){
        return res.status(400).send("Invalid credentials");
    }

    const token=jwt.sign({userId:userExists._id,name:userExists.name,userEmail:userExists.email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
    
    return res.status(200).send({message:"User logged in successfully",token});
}

exports.getProfile=async (req,res)=>{
    const user=req.user;
    const userFromDb=await User.findById(user.userId);
    if(!userFromDb){
        return res.status(404).send("User not found");
    }
    return res.status(200).send({name:userFromDb.name,email:userFromDb.email});
}