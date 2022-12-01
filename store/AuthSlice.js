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

    extraReducers: {
      [HYDRATE]: (state, action) => {
        console.log("HYDRATE", action.payload);
        if (!action.payload.auth.status) {
          // IMPORTANT - for not overriding data on client side
          return state;
        }
        state = action.payload.auth;
      },
    },
  },
});

export const { setAuthenticationStatus } = authSlice.actions;

export const selectAuthentication = (state) => state[authSlice.name];

export default authSlice;
