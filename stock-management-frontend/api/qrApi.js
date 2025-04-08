import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  "https://stock-management-system-4fdp.onrender.com/api/stocks";

export const fetchStockByQR = async (qrCode) => {
  const token = Cookies.get("token");
  if (!token) throw new Error("⚠️ Unauthorized: Please log in again.");

  const response = await axios.get(
    `${API_BASE_URL}/search?query=${encodeURIComponent(qrCode)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
