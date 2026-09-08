const Joi = require("joi");

const createJobSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    company: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    location: Joi.string()
        .trim()
        .max(150)
        .allow("")
        .optional(),

    description: Joi.string()
        .trim()
        .min(20)
        .max(10000)
        .required(),

    experience: Joi.string()
        .trim()
        .max(100)
        .allow("")
        .optional(),

    requiredSkills: Joi.array()
        .items(
            Joi.string()
                .trim()
                .max(100)
        )
        .max(50)
        .default([]),

    keywords: Joi.array()
        .items(
            Joi.string()
                .trim()
                .max(100)
        )
        .max(50)
        .default([])
});

const updateJobSchema = createJobSchema.fork(
    [
        "title",
        "company",
        "location",
        "description",
        "experience",
        "requiredSkills",
        "keywords"
    ],
    (schema) => schema.optional()
);

module.exports = {
    createJobSchema,
    updateJobSchema
};