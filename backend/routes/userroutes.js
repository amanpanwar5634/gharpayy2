const express = require("express");
const { loginUser, createAdmin, getProfile, resetPassword, logout, verifyPass } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const isSuperAdmin = require("../middleware/isSuperAdmin");

const router = express.Router();

router.post("/login", loginUser);
router.post("/create-admin", authMiddleware, isSuperAdmin, createAdmin); 
router.get("/profile/:id", authMiddleware, getProfile); 
router.post("/reset-password", authMiddleware, resetPassword);
router.post("/logout", logout);
router.post("/verify-password", verifyPass);


module.exports = router;