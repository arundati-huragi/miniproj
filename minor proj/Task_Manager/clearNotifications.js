const mongoose = require('mongoose');
const Notification = require('./backend/models/Notification');

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/taskmanager';

async function clearNotifications() {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const result = await Notification.deleteMany({});
    console.log(`Deleted ${result.deletedCount} notifications`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}

clearNotifications();
