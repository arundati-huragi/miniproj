const Task = require("../models/Task");
const { validateObjectId } = require("../utils/validation");
const sendEmail = require("../utils/emailSender");
const sendGridEmail = require("../utils/sendGridEmailSender");

// Existing exports...

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).select('title description reminderDate completed status');
    res.status(200).json({ tasks, status: true, msg: "Tasks found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.getTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    const task = await Task.findOne({ user: req.user.id, _id: req.params.taskId });
    if (!task) {
      return res.status(400).json({ status: false, msg: "No task found.." });
    }
    res.status(200).json({ task, status: true, msg: "Task found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.postTask = async (req, res) => {
  try {
    const { title, description, reminderDate, tasks } = req.body;

    if (tasks && Array.isArray(tasks)) {
      // Create multiple tasks
      if (tasks.length === 0) {
        return res.status(400).json({ status: false, msg: "Tasks array is empty" });
      }
      const tasksToCreate = tasks.map(desc => ({ user: req.user.id, description: desc }));
      const createdTasks = await Task.insertMany(tasksToCreate);
      return res.status(200).json({ tasks: createdTasks, status: true, msg: "Tasks created successfully.." });
    } else {
      // Create single task
      if (!description) {
        return res.status(400).json({ status: false, msg: "Description of task not found" });
      }
      const taskData = { user: req.user.id, title, description };
      if (reminderDate) {
        taskData.reminderDate = new Date(reminderDate);
      }
      const task = await Task.create(taskData);
      return res.status(200).json({ task, status: true, msg: "Task created successfully.." });
    }
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.putTask = async (req, res) => {
  try {
    const { title, description, reminderDate, status } = req.body;
    if (!description) {
      return res.status(400).json({ status: false, msg: "Description of task not found" });
    }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't update task of another user" });
    }

    const updateData = { title, description };
    if (reminderDate) {
      updateData.reminderDate = new Date(reminderDate);
    }
    if (status) {
      updateData.status = status;
      updateData.completed = status === "completed";
    }

    task = await Task.findByIdAndUpdate(req.params.taskId, updateData, { new: true });
    res.status(200).json({ task, status: true, msg: "Task updated successfully." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't delete task of another user" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.sendTestEmail = async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ status: false, msg: "User email not found" });
    }
    const subject = "Test Email from Listify";
    const text = "This is a test email to verify email notification functionality.";
    await sendEmail(userEmail, subject, text);
    res.status(200).json({ status: true, msg: "Test email sent successfully" });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ status: false, msg: "Failed to send test email" });
  }
};

exports.sendTaskEmailNotification = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    if (!validateObjectId(taskId)) {
      return res.status(400).json({ status: false, msg: "Invalid task ID" });
    }

    const task = await Task.findOne({ _id: taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ status: false, msg: "Task not found" });
    }

    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ status: false, msg: "User email not found" });
    }

    const subject = `Task Reminder: ${task.title || "Task Notification"}`;
    const text = `Hello,\n\nThis is a reminder for your task:\n\nTitle: ${task.title || "No title"}\nDescription: ${task.description}\n\nThank you.`;
    const html = `<p>Hello,</p><p>This is a reminder for your task:</p><p><strong>Title:</strong> ${task.title || "No title"}</p><p><strong>Description:</strong> ${task.description}</p><p>Thank you.</p>`;

    await sendGridEmail(userEmail, subject, text, html);

    res.status(200).json({ status: true, msg: "Task email notification sent successfully" });
  } catch (error) {
    console.error("Error sending task email notification:", error);
    res.status(500).json({ status: false, msg: "Failed to send task email notification" });
  }
};

// New function to create a test task with reminderDate a few minutes in the future
exports.createTestReminderTask = async (req, res) => {
  try {
    const now = new Date();
    const reminderDate = new Date(now.getTime() + 5 * 60000); // 5 minutes from now
    const taskData = {
      user: req.user.id,
      title: "Test Reminder Task",
      description: "This is a test task to verify reminder email functionality.",
      reminderDate,
      notified: false,
      status: "pending",
      completed: false,
    };
    const task = await Task.create(taskData);
    res.status(200).json({ task, status: true, msg: "Test reminder task created successfully." });
  } catch (error) {
    console.error("Error creating test reminder task:", error);
    res.status(500).json({ status: false, msg: "Failed to create test reminder task." });
  }
};
