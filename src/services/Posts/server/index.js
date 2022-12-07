import { getApplicationAccessToken } from "src/services/Authorization/server";

export const getPostInfo = async (submissionId, accessToken) => {
  try {
    const res = await fetch(
      `https://oauth.reddit.com/api/info.json?id=t3_${submissionId}&raw_json=1`,
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
