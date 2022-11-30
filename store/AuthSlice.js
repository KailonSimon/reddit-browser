import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  status: "unauthenticated",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticationStatus(state, action) {
      state.status = action.payload;
    },

    extraReducers(builder) {
      builder.addCase(HYDRATE, (state, { payload }) => ({
        ...state,
        ...payload,
      }));
    },
  },
});

export const { setAuthenticationStatus } = authSlice.actions;

export const selectAuthentication = (state) => state[authSlice.name];

export default authSlice;
