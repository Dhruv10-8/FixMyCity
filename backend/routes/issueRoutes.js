const express = require("express");
const router = express.Router();
const {createIssue, getAllIssues, getIssueById, upvoteIssue} = require("../controllers/issueController");
const upload = require('../middlewares/uploadMiddleware');
const { verifyToken } = require("../middlewares/authMiddleware");

// Routes
router.post("/", verifyToken , upload.single('image'), createIssue); // protect if needed
router.get("/", getAllIssues);
router.put("/:id/upvote", verifyToken, upvoteIssue);

module.exports = router;
