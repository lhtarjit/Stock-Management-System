const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: "StockItem" }],
  role: { type: String, enum: ["admin", "shopkeeper"], default: "shopkeeper" },
});

module.exports = mongoose.model("User", UserSchema);
