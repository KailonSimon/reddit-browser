import { createSlice, current } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { demoUserInitialData } from "../demoData/demoUser";

const initialState = demoUserInitialData;

export const demoUserSlice = createSlice({
  name: "demoUser",
  initialState,
  reducers: {
    setDemoUserState(state, action) {
      state = { state, ...action.payload };
    },
    subscribeToSubreddit(state, action) {
      state.subscribedSubreddits = [
        ...state.subscribedSubreddits,
        action.payload,
      ];
    },
    unsubscribeFromSubreddit(state, action) {
      state.subscribedSubreddits = state.subscribedSubreddits.filter(
        (subredditID) => subredditID !== action.payload
      );
    },
    visitPost(state, action) {
      state.visitedPosts = [
        action.payload,
        ...state.visitedPosts.filter((post) => post.id !== action.payload.id),
      ].slice(0, 5);
    },
    clearVisitedPosts(state) {
      state.visitedPosts = [];
    },

    extraReducers: {
      [HYDRATE]: (state, action) => {
        console.log("HYDRATE", action.payload);
        if (!action.payload.demoUser.name) {
          // IMPORTANT - for not overriding data on client side
          return state;
        }
        state = action.payload.demoUser;
      },
    },
  },
});

export const {
  setDemoUserState,
  subscribeToSubreddit,
  unsubscribeFromSubreddit,
  visitPost,
  clearVisitedPosts,
} = demoUserSlice.actions;

export const selectDemoUser = (state) => state[demoUserSlice.name];
export const selectVisitedPosts = (state) =>
  state[demoUserSlice.name].visitedPosts;

export default demoUserSlice;
