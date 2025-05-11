const express = require('express')
const router = express.Router()
const { verifyToken, requireRole } = require('../middlewares/authMiddleware')
const { getAllUsers, getStatusCount } = require('../controllers/adminDashboardController')
const { getUserDetails } = require('../controllers/dashboardController')
const { getUserIssues } = require('../controllers/issueController')

router.get("/admin", verifyToken, requireRole('admin'), getAllUsers)
router.get("/userissues", verifyToken, getUserIssues)
router.get("/issuestatus", verifyToken, requireRole('admin'), getStatusCount)
router.get("/", verifyToken, requireRole('user') || requireRole('admin'), getUserDetails)

module.exports = router