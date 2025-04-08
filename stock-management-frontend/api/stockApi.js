import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  "https://stock-management-system-4fdp.onrender.com/api/stocks";

const getAuthHeaders = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Unauthorized: Please log in again.");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };
};

export const uploadStockFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.post(
      `${API_BASE_URL}/upload`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Upload failed, please try again."
    );
  }
};

export const fetchStocks = async () => {
  const response = await axios.get(`${API_BASE_URL}/stocks`, getAuthHeaders());
  return response.data;
};

export const fetchStockById = async (id) => {
  const response = await axios.get(
    `${API_BASE_URL}/stocks/${id}`,
    getAuthHeaders()
  );
  return response.data;
};

export const searchStock = async (query) => {
  const url = query.trim()
    ? `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/stocks`;

  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};
