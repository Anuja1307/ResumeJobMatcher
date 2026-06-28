const bcrypt=require('bcrypt');
const User=require('../models/user');

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
    
    return res.status(200).send("User logged in successfully");
}