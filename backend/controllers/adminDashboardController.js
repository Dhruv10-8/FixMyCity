const User = require('../models/User');
const Issue = require('../models/Issue');
const Log = require('../models/Logs');

exports.getAllUsers = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getStatusCount = async (req, res) => {
  try {
    const [pendingCount, inProgressCount, resolvedCount] = await Promise.all([
      Issue.countDocuments({ status: "pending" }),
      Issue.countDocuments({ status: "in progress" }),
      Issue.countDocuments({ status: "resolved" }),
    ]);
    res.json({
      pending: pendingCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
    });
  } catch (error) {
    console.error("Failed to fetch status counts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
    if (!issue){
      return res.status(404).json({ message: "Issue not found" });
    }
    const { status } = req.body;
    issue.status = status;
    if (status==='resolved'){
      await Log.create({
        title: issue.title,
        category: issue.category,
        reportedBy: issue.reportedBy,
        status: "resolved",
        dangerLevel: issue.dangerLevel,
      })
      await issue.deleteOne()
    }
    else{
      await issue.save()
    }
    res.status(200).json({ message: "Status updated successfully", issue });
  } catch (error) {
    console.error("Failed to change status:", error);
    res.status(500).json({ message: "Server error", error: error.message });    
  }
}
