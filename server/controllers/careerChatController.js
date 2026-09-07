const {
    generateRAGAnswer
} = require("../services/ragService");

const ChatConversation =require("../models/chatConversation");


const careerChat = async (req, res) => {
    try {

        const userId = req.user.userId;

        const {
            query,
            jobId,
            conversationId
        } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
            });
        }
        let conversation;

if (conversationId) {

    conversation =
        await ChatConversation.findOne({
            _id: conversationId,
            userId
        });

    if (!conversation) {
        return res.status(404).json({
            success: false,
            message: "Conversation not found"
        });
    }

} else {

    conversation =
        await ChatConversation.create({
            userId,
            jobId: jobId || null,
            messages: []
        });
}

const conversationHistory =
    conversation.messages.map(message => ({
        role: message.role,
        content: message.content
    }));

       const result = await generateRAGAnswer({
    userId,
    query,
    jobId: jobId || null,
    conversationHistory
});

 conversation.messages.push({
    role: "user",
    content: query
});

conversation.messages.push({
    role: "assistant",
    content: result.answer
});

await conversation.save();

        return res.status(200).json({
            success: true,
            conversationId: conversation._id,
            query,
            ...result
        });

    } catch (error) {

        console.error(
            "Career chat error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to generate career chat response"
        });
    }
};


module.exports = {
    careerChat
};