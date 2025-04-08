import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  "https://stock-management-system-4fdp.onrender.com/api/stocks";

const getAuthHeaders = () => {
  const token = Cookies.get("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Upload Stock File
export const uploadStockFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || "Upload failed, please try again.";
  }
};

// Fetch all Stocks File

export const fetchStocks = async () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Unauthorized: Please log in again.");

  const response = await axios.get(`${API_BASE_URL}/stocks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Fetch Stocks by Id

export const fetchStockById = async (id) => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Unauthorized: Please log in again.");

  const response = await axios.get(`${API_BASE_URL}/stocks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Search Stock File

export const searchStock = async (query) => {
  const token = Cookies.get("token");
  if (!token) throw new Error("⚠️ Unauthorized: Please log in again.");

  const url = query.trim()
    ? `${API_BASE_URL}/search?query=${query}`
    : `${API_BASE_URL}/stocks`;

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
