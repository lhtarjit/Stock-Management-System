import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { fetchStocks } from "../api/stockApi"; // Import API call
import { useRouter } from "next/router";

const StockTable = ({ refreshTrigger, searchResults }) => {
  const [stocks, setStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    if (searchResults !== null) {
      setStocks(searchResults);
      setCurrentPage(1);
    } else {
      loadStockData();
    }
  }, [refreshTrigger, searchResults]);

  const loadStockData = async () => {
    try {
      const data = await fetchStocks();
      setStocks(data);
    } catch (error) {
      toast.error(error.message || "Failed to load stock data.");
    }
  };

  const handleStockById = (id) => {
    router.push(`/stocks/${id}`);
  };

  const totalPages = Math.ceil(stocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStocks = stocks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        📦 Stock Inventory
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-md bg-white">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="border p-3">📌 Name</th>
              <th className="border p-3">📦 Quantity</th>
              <th className="border p-3">💰 Price</th>
              <th className="border p-3">📁 Category</th>
              <th className="border p-3">🔗 QR Code</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStocks.length > 0 ? (
              paginatedStocks.map((stock) => (
                <tr
                  key={stock._id}
                  className="hover:bg-gray-50 transition"
                  onClick={() => handleStockById(stock._id)}
                >
                  <td className="border p-3">{stock.name}</td>
                  <td className="border p-3">{stock.quantity}</td>
                  <td className="border p-3">${stock.price}</td>
                  <td className="border p-3">{stock.category}</td>
                  <td className="border p-3 flex items-center justify-center">
                    <Image
                      src={stock.qr_code}
                      alt="QR Code"
                      width={48}
                      height={48}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border p-4 text-center text-gray-500"
                >
                  No stock data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀ Previous
          </button>

          <span className="font-bold text-gray-700 text-center">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default StockTable;
