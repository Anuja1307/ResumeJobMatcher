const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewares/rateLimiter");
const {
    careerChat
} = require("../controllers/careerChatController");

const protect =
    require("../middlewares/authMiddleware");


router.post(
    "/",
    protect,
    rateLimiter(10, 60,"career-chat"),
    careerChat
);


module.exports = router;