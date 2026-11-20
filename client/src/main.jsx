
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes/Router";
import { store } from "./redux/store";
import CookieConsent from "./components/shared/CookieConsent";
import Loading from "./components/common/Loading";

import "./index.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <div>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
        <CookieConsent />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Provider>
  </React.StrictMode>
);
