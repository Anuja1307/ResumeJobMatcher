const express=require('express');
const router=express.Router();

const protect=require('../middlewares/authMiddleware');
const authController=require('../controllers/authController');

router.get("/",authController.dummFunction);
router.post("/register",authController.postRegister);
router.post("/login",authController.postLogin);
router.get("/profile",protect,authController.getProfile);

module.exports=router;