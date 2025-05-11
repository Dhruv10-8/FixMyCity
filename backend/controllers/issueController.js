const Issue = require("../models/Issue");
const supabase = require("../config/supabase"); // wherever you saved your supabase.js
const { v4: uuidv4 } = require('uuid'); // to create unique image names
const {assessDangerLevel} = require("../services/dangerClassifier")

exports.createIssue = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    let imageUrl = null;
    let imageName = null;
    const lat = parseFloat(req.body.lat);
    const lon = parseFloat(req.body.lon);
    const parsedLocation = {
      type: 'Point',
      coordinates: [lon, lat] // Note: [longitude, latitude]
    };

    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      imageName = `${uuidv4()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('fixmycity') // your bucket name
        .upload(imageName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('fixmycity')
        .getPublicUrl(imageName);

      imageUrl = publicUrlData.publicUrl;
    }

    const newIssue = new Issue({
      title,
      description,
      location: parsedLocation, // if sent as JSON string
      category,
      image: imageUrl ? { url: imageUrl, name: imageName } : undefined,
      reportedBy: req.user.id, // if you have auth
      dangerLevel: await assessDangerLevel(lat, lon)
    });

    await newIssue.save();
    res.status(201).json(newIssue);

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create issue", error: error.message });
  }
};

// Get all issues
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find({});
    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get issues", error: error.message });
  }
};

// Get issues by user
exports.getUserIssues = async (req, res) => {
  try {
    const userId = req.user.id
    const issues = await Issue.find({ reportedBy: userId });
    const totalReports = issues.length || 0;
    const totalUpvotesReceived = issues.reduce((sum, issue) => sum + (issue.upvotes?.length || 0), 0);
    return res.status(200).json({ issues, totalReports, totalUpvotesReceived })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get issue", error: error.message });
  }
};

// Upvote an issue
exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Prevent multiple upvotes from the same user
    if (issue.voters.includes(req.user._id)) {
      return res.status(400).json({ message: "You already upvoted this issue" });
    }

    issue.upvotes += 1;
    issue.voters.push(req.user._id);
    await issue.save();

    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upvote issue", error: error.message });
  }
};
