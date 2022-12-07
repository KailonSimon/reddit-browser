import { getApplicationAccessToken } from "src/services/Authorization/server";

export const getSubredditInfo = async (subreddit, accessToken) => {
  try {
    const res = await fetch(
      `https://oauth.reddit.com/r/${subreddit}/about.json?raw_json=1`,
      {
        headers: {
          Authorization: `Bearer ${
            accessToken || (await getApplicationAccessToken()).access_token
          }`,
        },
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getSubredditFlair = async (subreddit, accessToken) => {
  try {
    const res = await fetch(
      `https://oauth.reddit.com/r/${subreddit}/api/link_flair_v2`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getTrendingSubreddits = async (accessToken) => {
  try {
    const res = await fetch(
      `https://oauth.reddit.com/subreddits/popular.json?limit=5&raw_json=1`,
      {
        headers: {
          Authorization: `Bearer ${
            accessToken || (await getApplicationAccessToken()).access_token
          }`,
        },
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getSubscribedSubreddits = async (accessToken) => {
  try {
    const res = await fetch(
      `https://oauth.reddit.com/subreddits/mine/subscriber?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return await res.json();
  } catch (error) {
    console.log(error);
  }
};
