const express=require('express');
const router=express.Router();

const authController=require('../controllers/authController');

router.get("/",authController.dummFunction);
router.post("/register",authController.postRegister);
router.post("/login",authController.postLogin);

module.exports=router;