const express = require('express')
const router = express.Router()
const { verifyToken, requireRole } = require('../middlewares/authMiddleware')
const { getAllUsers, getStatusCount, changeStatus } = require('../controllers/adminDashboardController')
const { getUserDetails } = require('../controllers/dashboardController')
const { getUserIssues } = require('../controllers/issueController')

router.get("/admin", verifyToken, requireRole('admin'), getAllUsers)
router.get("/userissues", verifyToken, getUserIssues)
router.get("/issuestatus", verifyToken, requireRole('admin'), getStatusCount)
router.get("/", verifyToken, requireRole('user') || requireRole('admin'), getUserDetails)
router.patch("/changestatus/:id/status", verifyToken, requireRole('admin'), changeStatus)

module.exports = router