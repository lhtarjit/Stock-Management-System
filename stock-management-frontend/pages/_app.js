import { Provider } from "react-redux";
import store from "../store/store";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  );
}

export default MyApp;
