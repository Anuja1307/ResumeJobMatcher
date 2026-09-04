const mongoose=require('mongoose');

const jobSchema=new mongoose.Schema(
    {
    title:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    company:{type:String,required:true,trim:true},
    location:{type:String,required:true,trim:true},
    jobUrl:{type:String,default:null},
    salary: {
            type: String,       
            default: null
        },
   experience: {
    type: String,
    default: ""
},
    requiredSkills: {
    type: [String],
    default: []
},
    status:{
        type:String,
        enum:['saved','applied','interviewing','offered','rejected'],
        default:'saved'
    },
    embedding: {
    type: [Number],
    default: []
},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    }
    },{
        timestamps:true
    }
)

module.exports=mongoose.model('Job',jobSchema);