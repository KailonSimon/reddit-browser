import Color from "color";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

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

const getRelativeTime = (timestamp) => {
  return dayjs.unix(timestamp).fromNow();
};

const getDate = (timestamp) => {
  return dayjs.unix(timestamp).format("MMMM D, YYYY");
};

const getCondensedDate = (timestamp) => {
  return dayjs.unix(timestamp).format("MM/DD/YYYY");
};

const mergePages = (pages) => {
  const mergedPages = [];
  for (let i = 0; i < pages.length; i++) {
    mergedPages.push(
      ...pages[i].data.children.map((submission) => submission.data)
    );
  }
  return mergedPages;
};
const getNestedCommentClass = (depth) => {
  return depth % 5;
};

const createImageBlurData = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const fetchComments = async (postId, sorting, commentId) => {
  if (!!commentId) {
    const res = await fetch(
      `https://www.reddit.com/comments/${postId}.json?comment=${commentId}&limit=100&depth=10&sort=${sorting}&raw_json=1`
    );
    return await res.json();
  } else {
    const res = await fetch(
      `https://www.reddit.com/comments/${postId}.json?limit=100&depth=5&sort=${sorting}&raw_json=1`
    );
    return await res.json();
  }
};

const fetchMoreChildrenComments = async (childrenIds) => {
  const res = await fetch(
    `https://api.pushshift.io/reddit/comment/search?ids=${childrenIds}`
  );
  return await res.json();
};

const fetchSubreddits = async (searchValue) => {
  const res = await fetch(
    `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${searchValue}&include_profiles=false&limit=3`
  );
  return await res.json();
};

const fetchAuthenticatedUserData = async (accessToken) => {
  const res = await fetch(`https://oauth.reddit.com/api/v1/me.json`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return await res.json();
};

const getUserData = async (username) => {
  const res = await fetch(`https://www.reddit.com/user/${username}/about.json`);
  return await res.json();
};

const getCurrentUserData = async () => {
  const res = await fetch("/api/user");
  return await res.json();
};

const getSubredditInfo = async (subreddit) => {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`
  );
  return await res.json();
};

const getSubredditRules = async (subreddit) => {
  const res = await fetch(
    `https://api.reddit.com/r/${subreddit}/about/rules.json`
  );
  return await res.json();
};

const getSubredditWikiPages = async (subreddit) => {
  const res = await fetch(`https://api.reddit.com/r/${subreddit}/wiki/pages`);
  return await res.json();
};

const getSubredditWikiPage = async (subreddit, page) => {
  const res = await fetch(
    `https://api.reddit.com/r/${subreddit}/wiki/${page}.json`
  );
  return await res.json();
};

const getTrendingSubreddits = async (limit) => {
  const res = await fetch(
    `https://www.reddit.com/subreddits/popular.json?limit=${limit}&raw_json=1`
  );
  return await res.json();
};

const voteOnSubmission = async (id, direction) => {
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

const getOverlayColor = (awards) => {
  if (awards.filter((award) => award.name === "Gold").length > 0) {
    return "linear-gradient(188deg,rgba(255,230,0,.15) 1.7%,rgba(255,230,0,0) 46%),hsla(0,0%,100%,0)";
  } else if (awards.filter((award) => award.name === "Starry").length > 0) {
    return "linear-gradient(188deg,rgba(89,186,18,.25) 1.7%,rgba(255,230,0,0) 46%),hsla(0,0%,100%,0)";
  } else {
    return "tranparent";
  }
};

const getApplicationAccessToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    const res = await fetch("https://www.reddit.com/api/v1/access_token", {
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

const fetchPosts = async (
  subreddit,
  sorting = "hot",
  limit = 5,
  pageParam = ""
) => {
  try {
    const data = await fetch("/api/auth/accessToken");
    const access_token = data.json();
    if (!access_token) {
      throw Error("No access token");
    }
    let res;
    if (!!subreddit) {
      res = await fetch(
        `/api/posts/${subreddit}?sorting=${sorting}&limit=${limit}&pageParam=${pageParam}&raw_json=1`
      );
    } else {
      res = await fetch(
        `/api/posts?sorting=${sorting}&limit=${limit}&pageParam=${pageParam}&raw_json=1`
      );
    }
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const getSubscribedSubreddits = async () => {
  try {
    const res = fetch("/api/subreddits/subscriber");
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const isColorDark = (hexColor) => {
  const color = Color(hexColor);
  return color.isDark();
};

const createDemoComment = (subreddit_id, subreddit, body, depth) => {
  const id = uuidv4();
  return {
    subreddit_id,
    subreddit,
    author_flair_template_id: null,
    likes: true,
    replies: {
      kind: "Listing",
      data: {
        after: null,
        dist: null,
        modhash: "",
        geo_filter: "",
        children: [],
        before: null,
      },
    },
    id,
    author: "DemoUser",
    created_utc: Math.floor(Date.now() / 1000),
    score: 0,
    author_fullname: "",
    all_awardings: [],
    body,
    name: `t1_${id}`,
    is_submitter: false,
    downs: 0,
    body_html: body,
    gildings: {},
    distinguished: null,
    stickied: false,
    author_flair_text_color: null,
    score_hidden: false,
    locked: false,
    created: Math.floor(Date.now() / 1000),
    author_flair_text: null,
    controversiality: 0,
    depth,
    author_flair_background_color: null,
    ups: 0,
  };
};

export {
  getRelativeTime,
  getDate,
  getCondensedDate,
  createImageBlurData,
  toBase64,
  mergePages,
  getNestedCommentClass,
  fetchPosts,
  fetchComments,
  fetchMoreChildrenComments,
  fetchSubreddits,
  fetchAuthenticatedUserData,
  getUserData,
  getCurrentUserData,
  getSubredditInfo,
  getSubredditRules,
  getSubredditWikiPages,
  getSubredditWikiPage,
  getTrendingSubreddits,
  getSubscribedSubreddits,
  getApplicationAccessToken,
  voteOnSubmission,
  getOverlayColor,
  isColorDark,
  createDemoComment,
};
