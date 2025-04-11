import axios from "axios";
import Cookies from "js-cookie";

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/login`,
      { email, password },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.token) {
      Cookies.set("token", response.data.token, { expires: 0.5 });
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed.");
  }
};

export const registerUser = async ({ name, email, password, role }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/register`,
      { name, email, password, role },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Registration failed.");
  }
};

export const logoutUser = () => {
  Cookies.remove("token");
};
