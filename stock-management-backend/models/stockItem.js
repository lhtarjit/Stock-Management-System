const mongoose = require("mongoose");

const StockItemSchema = new mongoose.Schema(
  {
    item_id: { type: String, unique: true, required: true }, // Unique Identifier
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    qr_code: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockItem", StockItemSchema);
