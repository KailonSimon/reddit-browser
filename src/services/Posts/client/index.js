export const fetchPosts = async (
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
