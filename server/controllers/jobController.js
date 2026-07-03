const Job= require('../models/jobs');

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
        const {title,description,company,location,salary,jobUrl,status}=req.body;
        if(!title || !description || !company || !location){
            return res.status(400).json({success:false,message:"All fields are required"});
        }

        const userId=req.user.userId || req.user.id;
        const job=new Job({title,company,description,location,jobUrl,salary,status,userId});

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
    if(!job){
        return res.status(404).json({success:false,message:"Job not found"});
    }
    const userId=req.user.userId || req.user.id;
    if(job.userId.toString()!==userId.toString()){
        return res.status(403).json({success:false,message:"Unauthorized access"});
   }
   const {title,description,company,location,salary,status,jobUrl}=req.body;
   if(title!==undefined)job.title=title;
    if(description!==undefined)job.description=description;
    if(company!==undefined)job.company=company;
    if(location!==undefined)job.location=location;
    if(salary!==undefined)job.salary=salary;
    if(status!==undefined)job.status=status;
    if(jobUrl!==undefined)job.jobUrl=jobUrl;

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