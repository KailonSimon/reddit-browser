import { createSlice } from "@reduxjs/toolkit";
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
      ];
    },
    clearVisitedPosts(state) {
      state.visitedPosts = [];
    },
    upvoteSubmission(state, action) {
      if (
        state.upvotedSubmissions.some(
          (submission) => submission.id === action.payload.id
        )
      ) {
        state.upvotedSubmissions = state.upvotedSubmissions.filter(
          (submission) => submission.id !== action.payload.id
        );
      } else {
        state.upvotedSubmissions = [
          ...state.upvotedSubmissions,
          action.payload,
        ];
        if (
          state.downvotedSubmissions.some(
            (submission) => submission.id === action.payload.id
          )
        ) {
          state.downvotedSubmissions = state.downvotedSubmissions.filter(
            (submission) => submission.id !== action.payload.id
          );
        }
      }
    },
    downvoteSubmission(state, action) {
      if (
        state.downvotedSubmissions.some(
          (submission) => submission.id === action.payload.id
        )
      ) {
        state.downvotedSubmissions = state.downvotedSubmissions.filter(
          (submission) => submission.id !== action.payload.id
        );
      } else {
        state.downvotedSubmissions = [
          ...state.downvotedSubmissions,
          action.payload,
        ];
        if (
          state.upvotedSubmissions.some(
            (submission) => submission.id === action.payload.id
          )
        ) {
          state.upvotedSubmissions = state.upvotedSubmissions.filter(
            (submission) => submission.id !== action.payload.id
          );
        }
      }
    },
    saveSubmission(state, action) {
      if (
        state.savedSubmissions.some(
          (submission) => submission.id === action.payload.id
        )
      ) {
        state.savedSubmissions = state.savedSubmissions.filter(
          (submission) => submission.id !== action.payload.id
        );
      } else {
        state.savedSubmissions = [...state.savedSubmissions, action.payload];
      }
    },
    hideSubmission(state, action) {
      if (
        state.hiddenSubmissions.some(
          (submission) => submission.id === action.payload.id
        )
      ) {
        state.hiddenSubmissions = state.hiddenSubmissions.filter(
          (submission) => submission.id !== action.payload.id
        );
      } else {
        state.hiddenSubmissions = [...state.hiddenSubmissions, action.payload];
      }
    },
    postComment(state, action) {
      state.postedComments = [...state.postedComments, action.payload];
    },

    extraReducers: {
      [HYDRATE]: (state, action) => {
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
  upvoteSubmission,
  downvoteSubmission,
  saveSubmission,
  hideSubmission,
  postComment,
} = demoUserSlice.actions;

export const selectDemoUser = (state) => state[demoUserSlice.name];
export const selectVisitedPosts = (state) =>
  state[demoUserSlice.name].visitedPosts;
export const selectHiddenSubmissions = (state) =>
  state[demoUserSlice.name].hiddenSubmissions;

export default demoUserSlice;
