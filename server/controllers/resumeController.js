const { PassThrough } = require('stream');
const User=require('../models/user');
const cloudinary = require('../config/cloudinary');

const uploadBufferToCloudinary = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder: 'resumes',
                public_id: filename.replace(/\.[^/.]+$/, ''),
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        const passthrough = new PassThrough();
        passthrough.end(buffer);
        passthrough.pipe(stream);
    });
};

exports.uploadResume=async (req,res)=>{
    try{
        const file=req.file;
        if(!file){
            return res.status(400).json({success:false,message:"No file uploaded"});
        }

        const cloudinaryResult = await uploadBufferToCloudinary(file.buffer, file.originalname);
        const resumeUrl = cloudinaryResult.secure_url || cloudinaryResult.url;
        const userId=req.user?.userId || req.user?.id;

        if (!userId) {
            return res.status(401).json({success:false,message:"Unauthorized user identity missing"});
        }

        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }

        user.resume={
            filename: file.originalname,
            path: resumeUrl,
            uploadedAt: new Date()
        };

        await user.save();
        return res.status(200).json({success:true,message:"Resume uploaded successfully",resumeUrl});
    } catch (error) {
        console.error("Error uploading resume:", error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
};