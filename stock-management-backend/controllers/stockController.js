const QRCode = require("qrcode");
const StockItem = require("../models/stockItem");
const XLSX = require("xlsx");
const fs = require("fs");

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     if (!req.user?.id) {
//       return res.status(401).json({ error: "Unauthorized: User ID missing" });
//     }

//     const userId = req.user.id;
//     const filePath = req.file.path;

//     // Read and validate Excel file
//     const workbook = XLSX.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = XLSX.utils.sheet_to_json(sheet);

//     if (data.length === 0) {
//       fs.unlinkSync(filePath);
//       return res.status(400).json({ error: "Uploaded Excel file is empty" });
//     }

//     const requiredFields = ["name", "quantity", "price", "category"];
//     const missingFields = requiredFields.filter((field) => !data[0][field]);
//     if (missingFields.length > 0) {
//       fs.unlinkSync(filePath);
//       return res.status(400).json({
//         error: `Missing required columns: ${missingFields.join(", ")}`,
//       });
//     }

//     // Create initial items
//     const itemsToCreate = data.map((item) => ({
//       name: item.name,
//       quantity: Number(item.quantity),
//       price: Number(item.price),
//       category: item.category,
//       user: userId,
//     }));

//     // Insert items and generate QR codes
//     const createdItems = await StockItem.insertMany(itemsToCreate);
//     const itemsWithQR = await Promise.all(
//       createdItems.map(async (item) => {
//         const qrCodeUrl = await QRCode.toDataURL(item._id.toString());
//         return StockItem.findByIdAndUpdate(
//           item._id,
//           { qr_code: qrCodeUrl },
//           { new: true }
//         );
//       })
//     );

//     const lowStockItems = itemsWithQR.filter((item) => item.quantity < 5);
//     if (lowStockItems.length > 0) {
//       await Notification.insertMany(
//         lowStockItems.map((item) => ({
//           user: userId,
//           message: `Low stock alert: ${item.name} (${item.quantity} remaining)`,
//           itemId: item._id,
//           type: "low_stock",
//         }))
//       );
//     }

//     fs.unlinkSync(filePath);
//     res.status(201).json({
//       message: `${data.length} items uploaded successfully`,
//       data: itemsWithQR,
//     });
//   } catch (error) {
//     fs.unlinkSync(req.file?.path);
//     console.error("Upload error:", error);
//     res.status(500).json({
//       error: error.message.startsWith("E11000")
//         ? "Duplicate items detected"
//         : "File processing failed",
//       details: error.message,
//     });
//   }
// };

exports.uploadStock = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized: User ID missing" });
    }

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

    // Create stock items with item_id
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

    // Insert items and generate QR codes
    const createdItems = await StockItem.insertMany(itemsToCreate);

    const itemsWithQR = await Promise.all(
      createdItems.map(async (item) => {
        const itemDetailUrl = `https://localhost:3000/stocks/${item._id}`;
        const qrCodeUrl = await QRCode.toDataURL(itemDetailUrl);

        return StockItem.findByIdAndUpdate(
          item._id,
          { qr_code: qrCodeUrl },
          { new: true }
        );
      })
    );

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
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { query } = req.query;
    if (!query?.trim()) {
      return res.status(400).json({ error: "Search query required" });
    }

    const results = await StockItem.find({
      user: req.user.id,
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

    const items = await StockItem.find({ user: req.user.id })
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
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const item = await StockItem.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid item ID" });
    }
    res.status(500).json({ error: "Server error" });
  }
};
