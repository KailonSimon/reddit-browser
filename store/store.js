import { configureStore, combineReducers, createSlice } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice";
import demoUserSlice from "./DemoUserSlice";
import {
  nextReduxCookieMiddleware,
  wrapMakeStore,
} from "next-redux-cookie-wrapper";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import { useDispatch } from "react-redux";

const makeStore = wrapMakeStore(() =>
  configureStore({
    reducer: combineReducers({
      [authSlice.name]: authSlice.reducer,
      [demoUserSlice.name]: demoUserSlice.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(
        nextReduxCookieMiddleware({
          subtrees: [`${demoUserSlice.name}`, `${authSlice.name}`],
        })
      ),
    devTools: true,
  })
);

export const useAppDispatch = () => useDispatch();

export const wrapper = createWrapper(makeStore, {
  debug: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
});
