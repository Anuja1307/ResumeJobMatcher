const express = require("express");
const router = express.Router();

const {
    careerChat
} = require("../controllers/careerChatController");

const protect =
    require("../middlewares/authMiddleware");


router.post(
    "/",
    protect,
    careerChat
);


module.exports = router;