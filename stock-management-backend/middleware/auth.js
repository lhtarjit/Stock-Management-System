const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("🔍 Received Auth Header:", authHeader); // Logging received token

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extracting the token

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info
    next();
  } catch (err) {
    console.error("Token Verification Error:", err.message);
    res.status(401).json({ error: "Invalid or Expired Token" });
  }
};
