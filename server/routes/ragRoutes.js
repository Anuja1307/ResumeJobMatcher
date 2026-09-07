const express = require("express");

const router = express.Router();

const {
    testRAGIndexing,testRAGRetrieval,testRAGChat
} = require("../controllers/ragController");

const protect = require("../middlewares/authMiddleware");

router.post(
    "/test-index",
    protect,
    testRAGIndexing
);

router.post(
    "/test-retrieve",
    protect,
    testRAGRetrieval
);

router.post(
    "/test-chat",
    protect,
    testRAGChat
);

module.exports = router;