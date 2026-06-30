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
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const name=body.name;
        const email=body.email;
        const password=body.password;

        if(!name||!email||!password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({success:false,message:"User already exists"});
        }
        const user=new User({name,email,password:hashedPassword});
        await user.save();
        return res.status(201).json({success:true,message:"User registered successfully"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Server error"});
    }
}

exports.postLogin=async (req,res)=>{
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const email=body.email;
        const password=body.password;

        if(!email || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }

        const userExists=await User.findOne({email});

        if(!userExists){
            return res.status(400).json({success:false,message:"User does not exist"});
        }

        const isMatch=await bcrypt.compare(password,userExists.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid credentials"});
        }

        const token=jwt.sign({userId:userExists._id,name:userExists.name,userEmail:userExists.email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
        
        return res.status(200).json({success:true,message:"User logged in successfully",token});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success:false,message:"Server error"});
    }
}

exports.getProfile=async (req,res)=>{
    try {
        const user=req.user;
        const userFromDb=await User.findById(user?.userId || user?.id);
        if(!userFromDb){
            return res.status(404).json({success:false,message:"User not found"});
        }
        return res.status(200).json({success:true,user:{name:userFromDb.name,email:userFromDb.email}});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success:false,message:"Server error"});
    }
}