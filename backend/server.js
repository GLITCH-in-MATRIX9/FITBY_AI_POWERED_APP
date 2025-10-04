const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ---------------------- IMPORT ROUTES ----------------------
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blogRoutes");
const videoRoutes = require("./routes/videoRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const aiDietPlanRoutes = require("./routes/aiDietPlanRoutes");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoute = require("./routes/payment"); // Stripe

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------- CORS ----------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://fitby-ai-powered-app-qk94.vercel.app",
  "https://fitby-fitness-ai-powered-app.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight OPTIONS globally
app.options("*", cors());

// ---------------------- BODY PARSING ----------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------------------- STATIC FILES ----------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------- API ROUTES ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/orkes-diet", aiDietPlanRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/personalized-trainer", paymentRoute);

// ---------------------- TEST CORS ----------------------
app.get("/test-cors", (req, res) => {
  res.json({ message: "✅ CORS is working!" });
});

// ---------------------- REACT FRONTEND (optional) ----------------------
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "client", "build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// ---------------------- MONGODB CONNECTION ----------------------
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fitnessAppDB";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();
