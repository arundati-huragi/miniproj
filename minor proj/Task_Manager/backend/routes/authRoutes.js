const express = require("express");
const router = express.Router();
const { signup, login, deleteUser } = require("../controllers/authControllers");
const { verifyAccessToken } = require("../middlewares/index.js");

// Routes beginning with /api/auth
router.post("/signup", signup);
router.post("/login", login);
router.delete("/delete", verifyAccessToken, deleteUser);

module.exports = router;