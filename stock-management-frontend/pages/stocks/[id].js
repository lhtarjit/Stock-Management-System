import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchStockById } from "../../api/stockApi";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../store/loaderSlice";
import Loader from "../../components/common/loader";

export default function StockPage() {
  const router = useRouter();
  const { id } = router.query;

  const [stock, setStock] = useState(null);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.loading);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id) => {
    dispatch(showLoader());

    try {
      const data = await fetchStockById(id);
      setStock(data);
      dispatch(hideLoader());
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch item.");
    } finally {
      dispatch(hideLoader());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader size="h-8 w-8" color="text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-12">Error: {error}</div>;
  }

  if (!stock) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-6 px-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-all"
        >
          <FaArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">Back</span>
        </button>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 text-center sm:text-left transition-all">
          📦 Stock Management System
        </h1>
      </div>

      {/* Stock Details */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center sm:text-left">
          {stock.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-5 rounded-lg shadow-sm">
            <span className="block text-gray-500 text-sm">Quantity</span>
            <span className="text-2xl font-bold text-blue-900">
              {stock.quantity}
            </span>
          </div>

          <div className="bg-green-50 p-5 rounded-lg shadow-sm">
            <span className="block text-gray-500 text-sm">Price</span>
            <span className="text-2xl font-bold text-green-900">
              ${stock.price}
            </span>
          </div>

          <div className="bg-purple-50 p-5 rounded-lg shadow-sm sm:col-span-2">
            <span className="block text-gray-500 text-sm">Category</span>
            <span className="text-2xl font-bold text-purple-900">
              {stock.category}
            </span>
          </div>
        </div>

        {stock.qr_code && (
          <div className="mt-10 text-center border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">QR Code</h3>
            <img
              src={stock.qr_code}
              alt="QR Code"
              className="inline-block w-40 h-40 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
