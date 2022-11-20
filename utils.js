import dayjs from "dayjs";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const updateLocale = require("dayjs/plugin/updateLocale");
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy",
  },
});

export const getRelativeTime = (timestamp) => {
  return dayjs.unix(timestamp).fromNow();
};

export const getDate = (timestamp) => {
  return dayjs.unix(timestamp).format("MMMM D, YYYY");
};

export const mergePages = (pages) => {
  const mergedPages = [];
  for (let i = 0; i < pages.length; i++) {
    mergedPages.push(...pages[i].data.children);
  }
  return mergedPages;
};

export const getNestedCommentClass = (depth) => {
  return depth % 5;
};

const dev = process.env.NODE_ENV !== "production";
const server = dev
  ? "http://localhost:3000"
  : "https://reddit-browser.vercel.app";

export const fetchPosts = async (
  sorting = "hot",
  subreddit = "all",
  limit = 5,
  pageParam = ""
) => {
  const res = await fetch(
    `${server}/api/posts/${subreddit}?sorting=${sorting}&limit=${limit}&pageParam=${pageParam}`
  );
  return await res.json();
};

export const fetchComments = async (postId, sorting, commentId) => {
  if (!!commentId) {
    const res = await fetch(
      `https://www.reddit.com/comments/${postId}.json?comment=${commentId}&limit=100&depth=10&sort=${sorting}`
    );
    return await res.json();
  } else {
    const res = await fetch(
      `https://www.reddit.com/comments/${postId}.json?limit=100&depth=5&sort=${sorting}`
    );
    return await res.json();
  }
};

export const fetchMoreChildrenComments = async (childrenIds) => {
  const res = await fetch(
    `https://api.pushshift.io/reddit/comment/search?ids=${childrenIds}`
  );
  return await res.json();
};

export const fetchSubreddits = async (searchValue) => {
  const res = await fetch(
    `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${searchValue}&include_profiles=false&limit=3`
  );
  return await res.json();
};

export const fetchAuthenticatedUserData = async (accessToken) => {
  const res = await fetch(`https://oauth.reddit.com/api/v1/me.json`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return await res.json();
};

export const getUserData = async (username) => {
  const res = await fetch(`https://www.reddit.com/user/${username}/about.json`);
  return await res.json();
};

export const getCurrentUserData = async () => {
  const res = await fetch("/api/user");
  return await res.json();
};

export const getSubredditInfo = async (subreddit) => {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`
  );
  return await res.json();
};

export const getTrendingSubreddits = async (limit) => {
  const res = await fetch(
    `https://www.reddit.com/subreddits/popular.json?limit=${limit}&raw_json=1`
  );
  return await res.json();
};

export const voteOnSubmission = async (id, direction) => {
  let directionNumber;
  switch (direction) {
    case "up":
      directionNumber = 1;
      break;
    case "down":
      directionNumber = -1;
      break;
    default:
      directionNumber = 0;
      break;
  }
  const res = await fetch("/api/vote", {
    method: "POST",
    body: JSON.stringify({ id, direction: directionNumber }),
  });
  return await res.json();
};
