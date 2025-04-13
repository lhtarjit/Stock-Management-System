import { Provider, useDispatch } from "react-redux";
import store from "../store/store";
import Loader from "../components/common/loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { setUser } from "../store/userSlice";

function AppContent({ Component, pageProps }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.loading);

  useEffect(() => {
    const token = Cookies.get("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      dispatch(setUser(JSON.parse(userData)));
    }
  }, [dispatch]);

  return (
    <>
      {loading && <Loader />}
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function MyApp(props) {
  return (
    <Provider store={store}>
      <AppContent {...props} />
    </Provider>
  );
}

export default MyApp;
