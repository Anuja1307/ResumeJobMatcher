const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(

    {

        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        resume: {

            filename: String,

            path: String,

            resumeText: String,


                embedding: {
    type: [Number],
    default: []
},

            structuredResume: {

                personal: {

                    name: String,

                    email: String,

                    phone: String,

                    location: String,

                    linkedin: String,

                    github: String,

                    portfolio: String
                },

                summary: String,

                skills: [String],

                education: [{

                    degree: String,

                    field: String,

                    institution: String,

                    location: String,

                    startYear: String,

                    endYear: String,

                    cgpa: String
                }],

                experience: [{

                    company: String,

                    role: String,

                    description: String
                }],

                projects: [{

                    name: String,

                    technologies: [String],

                    description: String
                }],

                certifications: [String],

                achievements: [String],

                languages: [String],

                nerEntities: {

    persons: [{
        type: {
            type: String
        },
        start: Number,
        end: Number,
        text: String
    }],

    organizations: [{
        type: {
            type: String
        },
        start: Number,
        end: Number,
        text: String
    }],

    locations: [{
        type: {
            type: String
        },
        start: Number,
        end: Number,
        text: String
    }],

    miscellaneous: [{
        type: {
            type: String
        },
        start: Number,
        end: Number,
        text: String
    }]
},

                rawText: String
            },

            uploadedAt: Date
        }

    },

    {
        timestamps: true
    }

);
console.log(
    "PERSONS PATH:",
    userSchema.path("resume.structuredResume.nerEntities.persons")
);

console.log(
    "ORGANIZATIONS PATH:",
    userSchema.path("resume.structuredResume.nerEntities.organizations")
);


module.exports = mongoose.model('User', userSchema);