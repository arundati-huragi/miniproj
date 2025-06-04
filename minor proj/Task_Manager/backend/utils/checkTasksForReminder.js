const mongoose = require('mongoose');
const Task = require('../models/Task');
require('dotenv').config({ path: __dirname + '/../.env' });

const checkTasksForReminder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const now = new Date();
    const tasks = await Task.find({
      reminderDate: { $lte: now },
      notified: false,
    }).populate('user');

    if (tasks.length === 0) {
      console.log('No tasks found with reminderDate <= now and notified false.');
    } else {
      console.log(`Found ${tasks.length} task(s) to notify:`);
      tasks.forEach(task => {
        console.log(`Task ID: ${task._id}, Description: ${task.description}, User Email: ${task.user ? task.user.email : 'No user email'}`);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error checking tasks for reminder:', error);
  }
};

checkTasksForReminder();
