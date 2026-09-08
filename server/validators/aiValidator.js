const Joi = require("joi");

const careerChatSchema = Joi.object({
    query: Joi.string()
        .trim()
        .min(1)
        .max(2000)
        .required(),

    conversationId: Joi.string()
        .hex()
        .length(24)
        .optional(),

    jobId: Joi.string()
        .hex()
        .length(24)
        .optional()
});

const interviewStartSchema = Joi.object({
    jobId: Joi.string()
        .hex()
        .length(24)
        .required()
});

const interviewAnswerSchema = Joi.object({
    answer: Joi.string()
        .trim()
        .min(1)
        .max(5000)
        .required()
});


module.exports = {
    careerChatSchema,
    interviewStartSchema,
    interviewAnswerSchema
};

