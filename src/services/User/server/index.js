import { getApplicationAccessToken } from "src/services/Authorization/server";

export const getUserData = async (username, accessToken) => {
  const res = await fetch(
    `https://oauth.reddit.com/user/${username}/about.json`,
    {
      headers: {
        Authorization: `Bearer ${
          accessToken || (await getApplicationAccessToken()).access_token
        }`,
      },
    }
  );
  return await res.json();
};

export const getCurrentUserData = async (accessToken) => {
  const res = await fetch(`https://oauth.reddit.com/api/me?raw_json=1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return await res.json();
};
