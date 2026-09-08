const bcrypt=require('bcrypt');
const User=require('../models/user');
const jwt=require('jsonwebtoken');
const {
    generateOTP,
    storeOTP,verifyOTP,canResendOTP,checkOTPRequestLimit,
    storePasswordResetOTP,verifyPasswordResetOTP
} = require("../services/otpService");

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

        const otp = generateOTP();
        await storeOTP(user.email, otp);
        console.log("OTP:", otp);

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
        if (!user.isVerified) {
    return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in"
    });
}
        const isMatch=await bcrypt.compare(password,userExists.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid credentials"});
        }

        const token=jwt.sign({userId:userExists._id,name:userExists.name,userEmail:userExists.email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
        
        return res.status(200).json({
            success:true,
            message:"User logged in successfully",
            token,
            user:{
                id:userExists._id,
                name:userExists.name,
                email:userExists.email,
                resume:userExists.resume || null
            }
        });
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
        return res.status(200).json({
            success:true,
            user:{
                id:userFromDb._id,
                name:userFromDb.name,
                email:userFromDb.email,
                resume:userFromDb.resume || null
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({success:false,message:"Server error"});
    }
}

exports.verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const result = await verifyOTP(email, otp);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isVerified = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error(
            "OTP verification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to verify OTP"
        });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const normalizedEmail = email.toLowerCase();

        const allowed = await checkOTPRequestLimit(
    normalizedEmail,
    5,
    60
);

if (!allowed) {
    return res.status(429).json({
        success: false,
        message: "Too many OTP requests. Please try again later."
    });
}

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        const resendCheck =
            await canResendOTP(normalizedEmail);

        if (!resendCheck.allowed) {
            return res.status(429).json({
                success: false,
                message: `Please wait ${resendCheck.remainingSeconds} seconds before requesting another OTP`
            });
        }

        const otp = generateOTP();

        await storeOTP(normalizedEmail, otp);

        // Temporary development logging
        console.log("OTP:", otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("Resend OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to resend OTP"
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        // Don't reveal whether an account exists
        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account exists with this email, an OTP has been sent"
            });
        }

        const allowed = await checkOTPRequestLimit(
            normalizedEmail,
            5,
            60
        );

        if (!allowed) {
            return res.status(429).json({
                success: false,
                message:
                    "Too many OTP requests. Please try again later."
            });
        }

        const otp = generateOTP();

        await storePasswordResetOTP(
            normalizedEmail,
            otp
        );

        // Temporary development logging
        console.log("Password reset OTP:", otp);

        return res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, an OTP has been sent"
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to process password reset request"
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        const normalizedEmail = email.toLowerCase();

        // Verify reset OTP
        const otpResult = await verifyPasswordResetOTP(
            normalizedEmail,
            otp
        );

        if (!otpResult.success) {
            return res.status(400).json({
                success: false,
                message: otpResult.message
            });
        }

        // Find user
        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Unable to reset password"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to reset password"
        });
    }
};