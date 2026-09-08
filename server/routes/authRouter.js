const express=require('express');
const router=express.Router();
const validate = require("../middlewares/validator");
const {
    registerSchema,
    loginSchema,
    otpSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require("../validators/authValidator");

const protect=require('../middlewares/authMiddleware');
const authController=require('../controllers/authController');
const  {verifyEmailOTP,resendOTP,forgotPassword,resetPassword}= require("../controllers/authController");
router.get("/",authController.dummFunction);
router.post("/register", validate(registerSchema), authController.postRegister);
router.post("/login", validate(loginSchema), authController.postLogin);
router.get("/profile",protect,authController.getProfile);
router.post("/verify-email-otp", validate(otpSchema), verifyEmailOTP);
router.post("/resend-otp", validate(forgotPasswordSchema), resendOTP);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
module.exports=router;