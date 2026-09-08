const express=require('express');

const resumeController=require('../controllers/resumeController');
const protect=require('../middlewares/authMiddleware');
const upload=require('../middlewares/cloudinary');
const {getResumeAnalysis} = require("../controllers/resumeAnalysisController");
const rateLimiter = require("../middlewares/rateLimiter");
const router=express.Router();

router.post('/upload',protect,upload.single('resume'),resumeController.uploadResume);



router.get(
    "/analysis",
    protect,
    rateLimiter(5, 60, "resume-analysis"),
    getResumeAnalysis
);


module.exports = router;

