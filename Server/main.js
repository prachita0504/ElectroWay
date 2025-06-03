require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./module/User");
const SavedStation = require("./module/SavedStation");

const app = express();
app.use(express.json());


app.use(
  cors({
    origin: "https://electro-way-z7od.vercel.app", 
    credentials: true,
  })
);


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("JWT_SECRET not defined in .env");
  process.exit(1);
}


app.post("/signup", async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;
  if (!email || !username || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "4h" });
    res.status(201).json({ message: "Registered successfully!", token });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "4h" });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


app.get("/savedStations", auth, async (req, res) => {
  try {
    const stations = await SavedStation.find({ userId: req.userId });
    res.json(stations);                       // already includes lat / lon
  } catch (err) {
    console.error("GET /savedStations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/savedStations", auth, async (req, res) => {
  const { stationId, lat, lon, tags, note } = req.body;
  if (!stationId || lat == null || lon == null)
    return res
      .status(400)
      .json({ message: "stationId, lat, lon are required" });

  try {
    const exists = await SavedStation.findOne({
      userId: req.userId,
      stationId: String(stationId),
    });
    if (exists) return res.status(409).json({ message: "Already saved" });

    const doc = await SavedStation.create({
      userId: req.userId,
      stationId: String(stationId),
      lat,
      lon,
      tags: tags || {},
      note: note || "",
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error("POST /savedStations:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.patch("/savedStations/:stationId", auth, async (req, res) => {
  const { stationId } = req.params;
  const { note } = req.body;
  try {
    const savedStation = await SavedStation.findOne({
      userId: req.userId,
      stationId: String(stationId),
    });
    if (!savedStation)
      return res.status(404).json({ message: "Saved station not found" });

    savedStation.note = note || "";
    await savedStation.save();
    res.json(savedStation);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/savedStations/:stationId", auth, async (req, res) => {
  const { stationId } = req.params;
  console.log(`Delete request for userId: ${req.userId}, stationId: ${stationId}`);
  try {
    const deleted = await SavedStation.findOneAndDelete({
      userId: req.userId,
      stationId: String(stationId),
    });
    if (!deleted) {
      return res.status(404).json({ message: "Station not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete saved station error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
