require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const path = require('path');
const authMiddleware = require("./middleware/authMiddleware");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, './uploads'))); 
app.use(express.static(path.join(__dirname, '../gharpayy.com')));
app.use("/fonts", express.static(path.join(__dirname, '../adminpages/fonts')));
app.use("/css", express.static(path.join(__dirname, '../adminpages/css')));
app.use("/js", express.static(path.join(__dirname, '../adminpages/js')));
app.use("/libs", express.static(path.join(__dirname, '../adminpages/libs')));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

const listingRoutes = require('./routes/listingroutes');
const userRoutes = require('./routes/userroutes');
const enquiry = require('./routes/enquiry');
app.use('/api/listings', listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enquiry", enquiry);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'gharpayy.com', 'index.html'));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../adminpages", "login.html"));
});

app.get("/dashboard", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../adminpages", "admin-index.html")); 
});

app.get("/addListing", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../adminpages/addListing.html"));
});

app.get("/allListings", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../adminpages/allListings.html"));
});

app.get("/enquirypage", authMiddleware, (req, res) => {
  
  res.sendFile(path.join(__dirname, "../adminpages/enquiry.html")); 
});

app.get("/profileSetting", (req, res) => {
  res.sendFile(path.join(__dirname, "../adminpages/profile-setting.html"));
});

app.get("/resetpass", (req, res) => {
  res.sendFile(path.join(__dirname, "../adminpages/reset-password.html"));
});

app.get("/invoice.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../adminpages/invoice.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
