export const getPosts = async (
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
