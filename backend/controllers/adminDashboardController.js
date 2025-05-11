const User = require('../models/User');

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
