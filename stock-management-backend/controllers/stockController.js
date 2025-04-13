const QRCode = require("qrcode");
const StockItem = require("../models/stockItem");
const XLSX = require("xlsx");
const fs = require("fs");
const User = require("../models/User");

exports.uploadStock = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (!req.user?.id)
      return res.status(401).json({ error: "Unauthorized: User ID missing" });

    const userId = req.user.id;
    const filePath = req.file.path;

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Uploaded Excel file is empty" });
    }

    const requiredFields = ["name", "quantity", "price", "category"];
    const missingFields = requiredFields.filter((field) => !data[0][field]);
    if (missingFields.length > 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: `Missing required columns: ${missingFields.join(", ")}`,
      });
    }

    const itemsToCreate = data.map((item) => {
      const item_id =
        item.name.replace(/\s+/g, "-").toLowerCase() + "-" + Date.now();

      return {
        item_id,
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        category: item.category,
        user: userId,
      };
    });

    const createdItems = await StockItem.insertMany(itemsToCreate);

    // Generate QR codes and update
    const itemsWithQR = await Promise.all(
      createdItems.map(async (item) => {
        const itemDetailUrl = `${process.env.CLIENT_URL}/stocks/${item._id}`;
        const qrCodeUrl = await QRCode.toDataURL(itemDetailUrl);

        return await StockItem.findByIdAndUpdate(
          item._id,
          { qr_code: qrCodeUrl },
          { new: true }
        );
      })
    );

    //  Push stock IDs to user
    const stockIds = itemsWithQR.map((item) => item._id);
    await User.findByIdAndUpdate(userId, {
      $push: { stocks: { $each: stockIds } },
    });

    fs.unlinkSync(filePath);
    res.status(201).json({
      message: `${data.length} items uploaded successfully`,
      data: itemsWithQR,
    });
  } catch (error) {
    fs.unlinkSync(req.file?.path || "");
    console.error("Upload error:", error);
    res.status(500).json({
      error: error.message.startsWith("E11000")
        ? "Duplicate items detected"
        : "File processing failed",
      details: error.message,
    });
  }
};

exports.searchStock = async (req, res) => {
  try {
    const { query } = req.query;

    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!query?.trim()) {
      return res.status(400).json({ error: "Search query required" });
    }

    const baseQuery = req.user.role === "admin" ? {} : { user: req.user.id };

    const results = await StockItem.find({
      ...baseQuery,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).select("-__v");

    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Search failed",
      details: error.message,
    });
  }
};

exports.getStock = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const query = req.user.role === "admin" ? {} : { user: req.user.id };
    console.log("Authenticated User:", req.user);

    const items = await StockItem.find(query)
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json(items);
  } catch (error) {
    console.error("Get stock error:", error);
    res.status(500).json({
      error: "Failed to fetch stock",
      details: error.message,
    });
  }
};

exports.getStockById = async (req, res) => {
  try {
    const stockId = req.params.id;

    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const query =
      req.user.role === "admin"
        ? { _id: stockId }
        : { _id: stockId, user: req.user.id };

    const item = await StockItem.findOne(query);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("getStockById error:", error);
    res.status(500).json({ error: "Failed to fetch item" });
  }
};
