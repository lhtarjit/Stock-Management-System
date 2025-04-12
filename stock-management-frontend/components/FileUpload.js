import { useState } from "react";
import { toast } from "react-toastify";
import parseExcel from "../utils/excelParser";
import { uploadStockFile } from "../api/stockApi";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../store/loaderSlice";
import Loader from "./common/loader";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.loading);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseAndValidateExcel(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      parseAndValidateExcel(droppedFile);
    }
  };

  const parseAndValidateExcel = (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async (e) => {
      const parsedData = parseExcel(e.target.result); // ✅ Fix: Directly pass `arrayBuffer`

      if (!parsedData) {
        toast.error("Invalid or empty Excel file.");
        return;
      }

      const requiredColumns = ["name", "quantity", "price", "category"];
      const fileColumns = Object.keys(parsedData[0]);

      if (!requiredColumns.every((col) => fileColumns.includes(col))) {
        toast.error("Excel must have only: name, quantity, price, category.");
        return;
      }

      setExcelData(parsedData);
      toast.success("File validated successfully!");
    };
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file first!");
      return;
    }

    dispatch(showLoader());
    try {
      await uploadStockFile(file);
      toast.success("Upload Successful!");
      dispatch(hideLoader());
      setFile(null);
      setExcelData([]);
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Upload failed. Try again.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFile(null);
    setExcelData([]);
    setDragging(false);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
      >
        Upload Stocks
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-50">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleClose}
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">
              📁 Upload Stock File
            </h2>

            <div
              className={`border-2 border-dashed p-6 w-full rounded-lg cursor-pointer flex items-center justify-center ${
                dragging
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              {file ? (
                <p className="text-gray-700">{file.name}</p>
              ) : (
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              )}
            </div>

            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />

            {excelData.length > 0 && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow">
                <p className="font-medium">Preview:</p>
                <ul className="list-disc pl-4 text-gray-700">
                  {excelData.slice(0, 5).map((row, index) => (
                    <li
                      key={index}
                    >{`${row.name} - ${row.quantity} units - $${row.price}`}</li>
                  ))}
                </ul>
                {excelData.length > 5 && (
                  <p className="text-sm text-gray-500">+ More...</p>
                )}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading}
              className={`mt-4 px-4 py-2 rounded-lg w-full h-10 font-semibold flex items-center justify-center transition ${
                loading
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {loading ? (
                <Loader size="h-3 w-3" color="text-white" />
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
