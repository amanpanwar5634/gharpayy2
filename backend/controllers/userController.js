const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jhsadhbjhsdhj";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, adminType: user.adminType }, JWT_SECRET, { expiresIn: "6h" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, adminType: user.adminType } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyPass =  async (req, res) => {
  const { userId, password } = req.body;

  try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

      res.json({ message: "Password verified successfully" });
  } catch (err) {
      res.status(500).json({ message: "Server error" });
  }
};


const createAdmin = async (req, res) => {
  try {
    const { name, email, password, adminType } = req.body;

    if (!name || !email || !password || !adminType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["super", "regular"].includes(adminType)) {
      return res.status(400).json({ message: "Invalid admin type. Only 'super' or 'regular' allowed." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({ name, email, password: hashedPassword, adminType });

    await admin.save();
    res.status(201).json({ message: `${adminType} admin created successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token"); 
  res.status(200).json({ message: "Logged out successfully" });
};

const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ message: "missing credentials" });
    }

    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { loginUser, createAdmin, getProfile, logout, resetPassword, verifyPass };