const express = require("express");
const router = express.Router();
const { getTasks, getTask, postTask, putTask, deleteTask, sendTestEmail, sendTaskEmailNotification, createTestReminderTask } = require("../controllers/taskControllers");
const notificationControllers = require("../controllers/notificationControllers");
const { verifyAccessToken } = require("../middlewares/index.js");

// Routes beginning with /api/tasks
router.get("/", verifyAccessToken, getTasks);
router.get("/:taskId", verifyAccessToken, getTask);
router.post("/", verifyAccessToken, postTask);
router.post("/test-email", verifyAccessToken, sendTestEmail);
router.post("/:taskId/send-email", verifyAccessToken, sendTaskEmailNotification);
router.post("/test-reminder-task", verifyAccessToken, createTestReminderTask);
router.put("/:taskId", verifyAccessToken, putTask);
router.delete("/:taskId", verifyAccessToken, deleteTask);

// Notification routes
router.get("/notifications", verifyAccessToken, notificationControllers.getNotifications);
router.put("/notifications/:id/read", verifyAccessToken, notificationControllers.markNotificationRead);

module.exports = router;
