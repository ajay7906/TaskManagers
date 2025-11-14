const Task = require("../models/Task");
const mongoose = require("mongoose");

// Basic analytics: counts by status, overdue, by user
exports.overview = async (req, res) => {
  try {
    // total by status
    const statusAgg = await Task.aggregate([
      { $match: {} },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // overdue tasks
    const now = new Date();
    const overdueCount = await Task.countDocuments({ dueDate: { $lt: now }, status: { $ne: "done" } });

    res.json({ byStatus: statusAgg, overdue: overdueCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// stats by user: completed & pending
exports.byUser = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $group: {
          _id: "$assignee",
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $ne: ["$status", "done"] }, 1, 0] } }
      }},
      { $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
      }},
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $project: {
          userId: "$_id",
          username: "$user.username",
          email: "$user.email",
          total: 1,
          completed: 1,
          pending: 1
      }}
    ]);

    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
