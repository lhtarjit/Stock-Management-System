import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchStockById,
  deleteStockById,
  updateStockById,
} from "../../api/stockApi";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../store/loaderSlice";
import Loader from "../../components/common/loader";
import Image from "next/image";

export default function StockPage() {
  const router = useRouter();
  const { id } = router.query;

  const [stock, setStock] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
  });

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.loading);
  const role = useSelector((state) => state.user.role);

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
      setFormData({
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        category: data.category,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch item.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this stock?"
    );
    if (!confirmed) return;

    dispatch(showLoader());
    try {
      await deleteStockById(id);
      toast.success("Stock deleted successfully!");
      router.push("/home");
    } catch (error) {
      toast.error(error.message || "Failed to delete stock.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleUpdate = async () => {
    dispatch(showLoader());
    try {
      const updated = await updateStockById(id, formData);
      setStock(updated.data);
      toast.success("Stock updated successfully!");
      setEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update stock.");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <div className="max-w-4xl mx-auto mb-6 px-2 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
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

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-10">
        <div className="flex flex-col justify-between items-center mb-6 sm:flex-row gap-4 sm:gap-0">
          {editing ? (
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="text-2xl sm:text-3xl font-semibold text-center sm:text-left border p-2 rounded w-full sm:w-auto"
            />
          ) : (
            <h2 className="text-2xl sm:text-3xl font-semibold text-center sm:text-left">
              {stock.name}
            </h2>
          )}

          {role === "admin" && (
            <div className="flex gap-4">
              {!editing ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-5 rounded-lg shadow-sm">
            <span className="block text-gray-500 text-sm">Quantity</span>
            {editing ? (
              <input
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                type="number"
                className="text-xl font-semibold text-blue-900 bg-white border p-2 rounded w-full"
              />
            ) : (
              <span className="text-2xl font-bold text-blue-900">
                {stock.quantity}
              </span>
            )}
          </div>

          <div className="bg-green-50 p-5 rounded-lg shadow-sm">
            <span className="block text-gray-500 text-sm">Price</span>
            {editing ? (
              <input
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                type="number"
                className="text-xl font-semibold text-green-900 bg-white border p-2 rounded w-full"
              />
            ) : (
              <span className="text-2xl font-bold text-green-900">
                ${stock.price}
              </span>
            )}
          </div>

          <div className="bg-purple-50 p-5 rounded-lg shadow-sm sm:col-span-2">
            <span className="block text-gray-500 text-sm">Category</span>
            {editing ? (
              <input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="text-xl font-semibold text-purple-900 bg-white border p-2 rounded w-full"
              />
            ) : (
              <span className="text-2xl font-bold text-purple-900">
                {stock.category}
              </span>
            )}
          </div>
        </div>

        {stock.qr_code && (
          <div className="mt-10 text-center border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">QR Code</h3>
            <Image
              src={stock.qr_code}
              alt="QR Code"
              className="inline-block w-40 h-40 object-contain"
              width={160}
              height={160}
            />
          </div>
        )}
      </div>
    </div>
  );
}
