import * as XLSX from "xlsx";

const parseExcel = (arrayBuffer) => {
  try {
    if (!arrayBuffer) {
      throw new Error("No file data received.");
    }

    // ✅ Convert ArrayBuffer to Uint8Array
    const data = new Uint8Array(arrayBuffer);

    // ✅ Read the Excel file properly
    const workbook = XLSX.read(data, { type: "array" });

    // ✅ Ensure at least one sheet exists
    if (!workbook.SheetNames.length) {
      throw new Error("No sheets found in Excel file.");
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // ✅ Convert sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    return jsonData.length > 0 ? jsonData : null;
  } catch (error) {
    console.error("❌ Error parsing Excel file:", error.message);
    return null;
  }
};

export default parseExcel;
