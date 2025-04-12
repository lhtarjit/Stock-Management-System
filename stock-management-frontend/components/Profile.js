import { useState } from "react";
import { useRouter } from "next/router";
import useClickOutside from "../utils/clickOutside";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/userSlice";
import Cookies from "js-cookie";

export default function Profile() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsDropdownOpen(false));
  const dispatch = useDispatch();

  // Get username from Redux store
  const username = useSelector((state) => state.user.name) || "User";

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    dispatch(logoutUser()); // Clear from Redux
    router.push("/");
  };

  return (
    <nav className="flex justify-end items-center">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center focus:outline-none"
        >
          <FaUserCircle className="w-10 h-10 text-gray-600" />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4">
              <p className="text-gray-800">Hi, {username}</p>
              <button
                onClick={handleLogout}
                className="w-full mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
