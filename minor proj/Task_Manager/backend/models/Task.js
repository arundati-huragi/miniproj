const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  reminderDate: {
    type: Date,
  },
  notified: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "pending"
  },
  assignedToEmail: {
    type: String,
  }
}, {
  timestamps: true
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
