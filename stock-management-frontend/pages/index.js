import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { toast } from "react-toastify";
import { loginUser, registerUser } from "../api/authApi";
import Cookies from "js-cookie";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { showLoader, hideLoader } from "../store/loaderSlice";
import Loader from "../components/common/loader";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "shopkeeper",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector((state) => state.loader.loading);

  // Redirect logged-in users to home
  useEffect(() => {
    if (Cookies.get("token")) {
      router.push("/home");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", role: "shopkeeper" });
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const passwordValidationRules = [
    {
      id: "length",
      message: "At least 8 characters",
      isValid: (password) => password.length >= 8,
    },
    {
      id: "uppercase",
      message: "At least 1 uppercase letter",
      isValid: (password) => /[A-Z]/.test(password),
    },
    {
      id: "number",
      message: "At least 1 number",
      isValid: (password) => /\d/.test(password),
    },
    {
      id: "specialChar",
      message: "At least 1 special character",
      isValid: (password) => /[@$!%*?&]/.test(password),
    },
  ];

  const isPasswordValid = (password) => {
    return passwordValidationRules.every((rule) => rule.isValid(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isLogin && !isPasswordValid(formData.password)) {
      toast.error("Please enter a valid password.");
      return;
    }

    if (!isLogin && formData.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    dispatch(showLoader());

    try {
      if (isLogin) {
        // Handle login
        const { token, user } = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        if (token) {
          Cookies.set("token", token);
          dispatch(setUser(user)); // store user data in Redux
          toast.success("Login successful!");
          router.push("/home");
        }
      } else {
        // Handle registration
        await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        toast.success("Registration successful! Logging you in...");

        const { token, user } = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        if (token) {
          Cookies.set("token", token);
          dispatch(setUser(user)); // store user data in Redux
          router.push("/home");
        } else {
          toast.error("Auto-login failed. Please log in manually.");
          dispatch(hideLoader());
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full p-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>

            {/* Password Validation Checklist (Only for Register) */}
            {!isLogin && formData.password && (
              <div className="mt-2 space-y-1">
                {passwordValidationRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`flex items-center text-sm ${
                      rule.isValid(formData.password)
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {rule.isValid(formData.password) ? (
                      <span className="mr-2">✔</span>
                    ) : (
                      <span className="mr-2">✖</span>
                    )}
                    {rule.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-600 hover:text-gray-800"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          )}

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Role
              </label>
              <select
                name="role"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="shopkeeper">Shopkeeper</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? (
              <Loader size="h-3 w-3" color="text-white" />
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
