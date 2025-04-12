import { Provider } from "react-redux";
import store from "../store/store";
import Loader from "../components/common/loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import { useSelector } from "react-redux";

function AppContent({ Component, pageProps }) {
  const loading = useSelector((state) => state.loader.loading);

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
