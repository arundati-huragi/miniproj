
const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationRead, deleteNotification } = require('../controllers/notificationControllers');
const { verifyAccessToken } = require('../middlewares/index'); // Correct middleware import

// Protect all routes
router.use(verifyAccessToken);

// GET /api/notifications - get notifications for logged in user
router.get('/', getNotifications);

// PATCH /api/notifications/:id - mark notification as read
router.patch('/:id', markNotificationRead);

// DELETE /api/notifications/:id - delete notification
router.delete('/:id', deleteNotification);

module.exports = router;
