import axios from "axios";
import Cookies from "js-cookie";

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
      `${process.env.NEXT_PUBLIC_STOCK_BASE_URL}/upload`,
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
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_STOCK_BASE_URL}/stocks`,
    getAuthHeaders()
  );
  return response.data;
};

export const fetchStockById = async (id) => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Unauthorized");

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_STOCK_BASE_URL}/stocks/${id}`,
    getAuthHeaders()
  );

  return response.data;
};

export const searchStock = async (query) => {
  const url = query.trim()
    ? `${
        process.env.NEXT_PUBLIC_STOCK_BASE_URL
      }/search?query=${encodeURIComponent(query)}`
    : `${process.env.NEXT_PUBLIC_STOCK_BASE_URL}/stocks`;

  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};

export const updateStockById = async (id, updatedData) => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_STOCK_BASE_URL}/stocks/${id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    }
  );

  return res.data;
};

export const deleteStockById = async (id) => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Unauthorized");

  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_STOCK_BASE_URL}/stocks/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
