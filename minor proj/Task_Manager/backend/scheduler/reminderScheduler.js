const cron = require('node-cron');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendGridEmailSender');

const TIMEZONE = 'Asia/Kolkata'; // IST timezone

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected successfully in reminderScheduler');
  } catch (error) {
    console.error('MongoDB connection error in reminderScheduler:', error);
  }
};

const checkReminders = async () => {
  try {
    if (!isConnected) {
      await connectDB();
    }
    const now = moment().tz(TIMEZONE).toDate();
    const tasks = await Task.find({
      reminderDate: { $lte: now },
      notified: false,
    }).populate('user');

    if (tasks.length === 0) {
      console.log('No tasks to notify at this time.');
    } else {
      console.log(`Found ${tasks.length} task(s) to notify.`);
    }

    for (const task of tasks) {
      if (!task.user) {
        console.log(`Skipping task ${task._id} due to missing user.`);
        continue;
      }

      if (!task.reminderDate) {
        console.log(`Skipping task ${task._id} due to missing reminderDate.`);
        continue;
      }

      const message = "Reminder for your task: \"" + (task.title || "Untitled") + "\" scheduled at " + task.reminderDate.toLocaleString();

      // Send reminder email
      try {
        await sendEmail(task.user.email, 'Task Reminder', message);
        console.log(`Reminder email sent to ${task.user.email} for task ${task._id}`);
      } catch (emailError) {
        console.error(`Failed to send reminder email to ${task.user.email} for task ${task._id}:`, emailError);
      }

      await Notification.create({ user: task.user._id, message, task: task._id });

      task.notified = true;
      await task.save();

      console.log(`Notification created for user ${task.user._id} for task ${task._id}`);
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

cron.schedule('* * * * *', () => {
  console.log('Running reminder check...');
  checkReminders();
});

module.exports = {
  checkReminders,
};
