import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:5001/api/auth";

// ✅ Login API
export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    if (response.data.token) {
      Cookies.set("token", response.data.token, { expires: 0.5 }); // Store token
    }

    return response.data; // Return the full response data
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed.");
  }
};

// ✅ Register API
export const registerUser = async ({ name, email, password, role }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      name,
      email,
      password,
      role,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Registration failed.");
  }
};

// Logout API
export const logoutUser = () => {
  Cookies.remove("token");
};
