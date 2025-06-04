
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('task');
    res.status(200).json({ notifications, status: true });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findOne({ _id: notificationId, user: req.user.id });
    if (!notification) {
      return res.status(404).json({ status: false, msg: 'Notification not found' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({ status: true, msg: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findOneAndDelete({ _id: notificationId, user: req.user.id });
    if (!notification) {
      return res.status(404).json({ status: false, msg: 'Notification not found' });
    }
    res.status(200).json({ status: true, msg: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};
