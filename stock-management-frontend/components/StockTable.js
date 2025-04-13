import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { fetchStocks } from "../api/stockApi";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../store/loaderSlice";
import Loader from "./common/loader";

const StockTable = ({ refreshTrigger, searchResults, query }) => {
  const [stocks, setStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.loading);

  const loadStockData = useCallback(async () => {
    dispatch(showLoader());
    try {
      const data = await fetchStocks();
      setStocks(data);
    } catch (error) {
      toast.error(error.message || "Failed to load stock data.");
    } finally {
      dispatch(hideLoader());
    }
  }, [dispatch]);

  useEffect(() => {
    if (searchResults !== null) {
      setStocks(searchResults);
      setCurrentPage(1);
    } else {
      loadStockData();
    }
  }, [refreshTrigger, searchResults, loadStockData]);

  const handleStockById = (id) => {
    router.push(`/stocks/${id}`);
  };

  const totalPages = Math.ceil(stocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStocks = stocks.slice(startIndex, startIndex + itemsPerPage);

  const highlightMatch = (text) => {
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <strong className=" text-gray-900">
          {text.slice(index, index + query.length)}
        </strong>
        {highlightMatch(text.slice(index + query.length))}
      </>
    );
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        📦 Stock Inventory
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full border-collapse border border-gray-300 shadow-md bg-white table-fixed">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="bg-gray-100 shadow-sm border p-3 text-gray-900">
                📌 Name
              </th>
              <th className="bg-blue-50 shadow-sm border p-3 text-blue-900">
                📦 Quantity
              </th>
              <th className="bg-green-50 shadow-sm border p-3 text-green-900">
                💰 Price
              </th>
              <th className="bg-purple-50 shadow-sm border p-3 text-purple-900">
                📁 Category
              </th>
              <th className="bg-yellow-50 shadow-sm border p-3 text-yellow-900">
                🔗 QR Code
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 align-middle">
                  <Loader size="h-4 w-4" color="text-blue-500" />
                </td>
              </tr>
            ) : paginatedStocks.length > 0 ? (
              paginatedStocks.map((stock) => (
                <tr
                  key={stock._id}
                  className="hover:bg-blue-100 h-16 transition cursor-pointer text-sm text-gray-800"
                  onClick={() => handleStockById(stock._id)}
                  colSpan="1"
                >
                  <td className="border p-3 truncate align-middle">
                    {highlightMatch(stock.name)}
                  </td>
                  <td className="border p-3 align-middle">{stock.quantity}</td>
                  <td className="border p-3 align-middle">${stock.price}</td>
                  <td className="border p-3 capitalize align-middle">
                    {highlightMatch(stock.category)}
                  </td>
                  <td className="border p-3 align-middle">
                    <div className="flex justify-center items-center">
                      <Image
                        src={stock.qr_code}
                        alt="QR Code"
                        width={48}
                        height={48}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-8 align-middle"
                >
                  No stock data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
