const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },
        category: {
            type: String,
            enum: ["pothole", "leak", "streetlight", "garbage", "other"],
            default: "other",
        },
        image: {
            url: { type: String, default: null },
            name: { type: String, default: null },
            path: { type: String, default: null }
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "in progress", "resolved"],
            default: "pending",
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        voters: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        dangerLevel: {
            type: String,
            enum: ["Low", "Medium", "High", "Unknown"],
            default: "Unknown",
        },
    },
    { timestamps: true }
);

// Create a geospatial index for location
IssueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Issue", IssueSchema);
