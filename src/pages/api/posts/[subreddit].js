import { getToken } from "next-auth/jwt";
import { getApplicationAccessToken } from "src/services/Authorization/server";

export default async function handler(req, res) {
  const { subreddit, sorting = "hot", limit = 5, pageParam } = req.query;

  async function makeRedditRequest(accessToken) {
    return fetch(
      `https://oauth.reddit.com/r/${subreddit}/${sorting}.json?limit=${limit}&after=${pageParam}&raw_json=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }

  const userAccessToken = getToken({ req })?.accessToken;

  try {
    const accessToken =
      userAccessToken || (await getApplicationAccessToken()).access_token;
    const redditRes = await makeRedditRequest(accessToken);
    res.status(redditRes.status).json(await redditRes.json());
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
