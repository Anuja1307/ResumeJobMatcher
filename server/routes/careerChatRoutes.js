const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewares/rateLimiter");
const {
    careerChat
} = require("../controllers/careerChatController");
const validate = require("../middlewares/validator");
const { careerChatSchema } = require("../validators/aiValidator");
const protect =
    require("../middlewares/authMiddleware");


router.post(
    "/",
    protect,validate(careerChatSchema),
    rateLimiter(10, 60,"career-chat"),
    careerChat
);




module.exports = router;