import { getApplicationAccessToken } from "src/services/Authorization/server";

export const getComments = async ({
  postId,
  commentId,
  sorting,
  accessToken,
}) => {
  if (!!commentId) {
    const res = await fetch(
      `https://oauth.reddit.com/comments/${postId}.json?comment=${commentId}&limit=100&depth=10&sort=${sorting}&raw_json=1`,
      {
        headers: {
          Authorization: `Bearer ${
            accessToken || (await getApplicationAccessToken()).access_token
          }`,
        },
      }
    );
    return await res.json();
  } else {
    const res = await fetch(
      `https://oauth.reddit.com/comments/${postId}.json?limit=100&depth=5&sort=${sorting}&raw_json=1`,
      {
        headers: {
          Authorization: `Bearer ${
            accessToken || (await getApplicationAccessToken()).access_token
          }`,
        },
      }
    );
    return await res.json();
  }
};
