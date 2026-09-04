const express=require('express');
const router=express.Router();

const jobController=require('../controllers/jobController');
const protect=require('../middlewares/authMiddleware');


router.get('/saved',protect,jobController.getJobs)

router.get('/saved/:id',protect,jobController.getJobById)

router.post('/save',protect,jobController.postJobs)
router.get("/matches", protect, jobController.getJobMatches);
router.put('/:id',protect,jobController.updateJob)

router.delete('/:id',protect,jobController.deleteJob)

module.exports=router;