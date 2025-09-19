const express = require("express");
const Enquiry = require('../models/Enquiry');

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newEnquiry = new Enquiry({ name, email, phone, message });
        await newEnquiry.save();

        res.status(201).json({ message: "Enquiry submitted successfully" });
    } catch (error) {
        console.error("Error saving enquiry:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports= router;