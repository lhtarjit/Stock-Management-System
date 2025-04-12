require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000"],
    credentials: true,
  })
);

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

const stockRoutes = require("./routes/stockRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/stocks", stockRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("🚀 Stock Management Backend is Running"));

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
