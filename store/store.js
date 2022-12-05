import { configureStore, combineReducers, createSlice } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice";
import demoUserSlice from "./DemoUserSlice";
import { createWrapper } from "next-redux-wrapper";
import { useDispatch } from "react-redux";

const makeStore = () =>
  configureStore({
    reducer: combineReducers({
      [authSlice.name]: authSlice.reducer,
      [demoUserSlice.name]: demoUserSlice.reducer,
    }),
  });

export const useAppDispatch = () => useDispatch();

export const wrapper = createWrapper(makeStore, {
  debug:
    (false && !process.env.NODE_ENV) || process.env.NODE_ENV === "development",
});
