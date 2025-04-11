import axios from "axios";
import Cookies from "js-cookie";

export const fetchStockByQR = async (qrCode) => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Unauthorized: Please log in again.");

  const response = await axios.get(
    `${
      process.env.NEXT_PUBLIC_STOCK_BASE_URL
    }/search?query=${encodeURIComponent(qrCode)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );

  return response.data;
};
