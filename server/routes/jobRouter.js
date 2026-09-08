const express=require('express');
const router=express.Router();
const auth = require("../middlewares/authMiddleware");
const {getATSScore} = require("../controllers/atsController");
const { getJobSpecificAnalysis} = require("../controllers/jobAnalysisLLMController");
const jobController=require('../controllers/jobController');
const protect=require('../middlewares/authMiddleware');
const rateLimiter = require("../middlewares/rateLimiter");
const validate = require("../middlewares/validator");

const {
    createJobSchema,
    updateJobSchema
} = require("../validators/jobValidator");


router.get('/saved',protect,jobController.getJobs)

router.get('/saved/:id',protect,jobController.getJobById)

router.post('/save',protect,validate(createJobSchema),jobController.postJobs)
router.get("/matches", protect, rateLimiter(10, 60, "job-matches"), jobController.getJobMatches);

router.get("/:jobId/ats", auth,rateLimiter(5, 60, "job-ats"), getATSScore);
router.get(
    "/:jobId/analysis",
    auth,
    rateLimiter(5, 60, "job-analysis"),
    getJobSpecificAnalysis
);

router.put('/:id',protect,validate(updateJobSchema),jobController.updateJob)

router.delete('/:id',protect,jobController.deleteJob)

module.exports=router;