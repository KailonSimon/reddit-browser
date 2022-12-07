export const fetchSubreddits = async (searchValue) => {
  const res = await fetch(
    `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${searchValue}&include_profiles=false&limit=3`
  );
  return await res.json();
};

export const getSubredditRules = async (subreddit) => {
  const res = await fetch(
    `https://api.reddit.com/r/${subreddit}/about/rules.json`
  );
  return await res.json();
};

export const getSubredditWikiPages = async (subreddit) => {
  const res = await fetch(`https://api.reddit.com/r/${subreddit}/wiki/pages`);
  return await res.json();
};

export const getSubredditWikiPage = async (subreddit, page) => {
  const res = await fetch(
    `https://api.reddit.com/r/${subreddit}/wiki/${page}.json`
  );
  return await res.json();
};
