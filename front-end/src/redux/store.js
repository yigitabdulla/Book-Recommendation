import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import toastifyReducer from "./slices/toastifySlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    toastify: toastifyReducer,
  },
});

export default store;
