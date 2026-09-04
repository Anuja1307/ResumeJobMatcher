const Job= require('../models/jobs');
const { generateEmbedding,extractJobSkills,extractJobKeywords } = require("../services/aiService");
const User = require("../models/user");
const { matchResumeToJobs } = require("../services/jobMatcher");
const resumeSkills =
    User.resume?.structuredResume?.skills || [];

const resumeExperience =
    User.resume?.structuredResume?.experience || [];

exports.getJobs=async (req,res)=>{
    const jobs=await Job.find({userId:req.user.userId || req.user.id});
    if(!jobs){
        return res.status(404).json({success:false,message:"No jobs found"});
    }
    res.status(200).json({success:true,jobs});
}

exports.getJobById=async (req,res)=>{
    try{
        const job=await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({success:false,message:"Job not found"});
        }
        
        if(job.userId.toString()!==req.user.userId.toString()){
            return res.status(403).json({success:false,message:"Unauthorized access"});
        }
        res.status(200).json({success:true,job});
}

 catch(err){
    if(err.name==='CastError'){
        return res.status(400).json({success:false,message:"Invalid job ID"});
    }
    console.error(err);
    return res.status(500).json({success:false,message:"Server error"});
 }
}

exports.postJobs=async (req,res)=>{
    try{
        const {title,description,company,location,salary,jobUrl,status,experience}=req.body;

       let requiredSkills = [];
let keywords = [];

try {
    requiredSkills =
        await extractJobSkills(description);
} catch (skillErr) {
    console.error(
        "Job skill extraction failed:",
        skillErr.message
    );
}

try {
    keywords =
        await extractJobKeywords(description);
} catch (keywordErr) {
    console.error(
        "Job keyword extraction failed:",
        keywordErr.message
    );
}

        if(!title || !description || !company || !location){
            return res.status(400).json({success:false,message:"All fields are required"});
        }

        const jobText = `
                Title: ${title}
                Company: ${company}
                Location: ${location}
                Experience: ${experience || ""}
                Description: ${description}
                Salary: ${salary || ""}`;
        
        let embedding = [];
        try {
            embedding = await generateEmbedding(jobText);
        } catch (embedErr) {
            console.error("Embedding generation failed during job creation:", embedErr.message);
        }

        const userId=req.user.userId || req.user.id;
        const job=new Job({title,company,description,location,jobUrl,salary,experience,requiredSkills,keywords,status,userId,embedding});

        await job.save();
        return res.status(201).json({success:true,message:"Job created successfully",job});
    }
    catch(err){
        if(err.name==='ValidationError'){
        return res.status(400).json({success:false,message:err.message});
    }

    console.error(err);
    return res.status(500).json({success:false,message:"Server error"});
    }
}

exports.updateJob=async (req,res)=>{
   try{
    const job=await Job.findById(req.params.id);
    const {title,description,company,location,salary,jobUrl,status,experience}=req.body;
    if(!job){
        return res.status(404).json({success:false,message:"Job not found"});
    }
    const userId=req.user.userId || req.user.id;
    if(job.userId.toString()!==userId.toString()){
        return res.status(403).json({success:false,message:"Unauthorized access"});
   }
   let contentChanged = false;

   if(title!==undefined && title!==job.title){ job.title=title; contentChanged=true; }
   if(description!==undefined && description!==job.description){ job.description=description; contentChanged=true; }
   if(company!==undefined && company!==job.company){ job.company=company; contentChanged=true; }
   if(location!==undefined && location!==job.location){ job.location=location; contentChanged=true; }
   if(salary!==undefined && salary!==job.salary){ job.salary=salary; contentChanged=true; }
   if(experience!==undefined && experience!==job.experience){ job.experience=experience; contentChanged=true; }
   if(status!==undefined) job.status=status;
   if(jobUrl!==undefined) job.jobUrl=jobUrl;

   if (contentChanged || !job.embedding || job.embedding.length === 0) {
       const jobText = `
                Title: ${job.title}
                Company: ${job.company}
                Location: ${job.location}
                Experience: ${job.experience || ""}
                Description: ${job.description}
                Salary: ${job.salary || ""}`;
       try {
           job.embedding = await generateEmbedding(jobText);
       } catch (embedErr) {
           console.error("Embedding generation failed during job update:", embedErr.message);
       }
   }

    await job.save();
    return res.status(200).json({success:true,message:"Job updated successfully",job});
}
catch(err){
    if(err.name==='CastError'){
        return res.status(400).json({success:false,message:"Invalid job ID"});
    }
    if(err.name==='ValidationError'){
        return res.status(400).json({success:false,message:err.message});
    }
    console.error(err);
    return res.status(500).json({success:false,message:"Server error"});
}
}

exports.deleteJob=async (req,res)=>{
    try{
        const job=await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({success:false,message:"Job not found"});
        }
        const userId=req.user.userId || req.user.id;
        if(job.userId.toString()!==userId.toString()){
            return res.status(403).json({success:false,message:"Unauthorized access"});
        }
        await job.deleteOne();
        return res.status(200).json({success:true,message:"Job deleted successfully"});

    }
    catch(err){
        if(err.name==='CastError'){
            return res.status(400).json({success:false,message:"Invalid job ID"});
        }
        console.error(err);
        return res.status(500).json({success:false,message:"Server error"});
    }
}
exports.getJobMatches = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const resumeEmbedding =user.resume?.embedding;
        const resumeSkills =user.resume?.structuredResume?.skills || [];

        if (
            !resumeEmbedding ||
            resumeEmbedding.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume first"
            });
        }

       const matches = await matchResumeToJobs(
        userId,
        resumeEmbedding,
        resumeSkills,
        resumeExperience
    );

      const results = matches.map(match => ({
    job: match.job,

    semanticScore:
        match.semanticScore,

    skillsScore:
        match.skillsScore,

    experienceScore:
        match.experienceScore,

    finalScore:
        match.finalScore,

    matchedSkills:
        match.matchedSkills,

    missingSkills:
        match.missingSkills,

    candidateYears:
        match.candidateYears,

    requiredYears:
        match.requiredYears
}));

        return res.status(200).json({
            success: true,
            matches: results
        });

    } catch (err) {

        console.error(
            "Error generating job matches:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};