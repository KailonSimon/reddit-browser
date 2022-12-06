import { getToken } from "next-auth/jwt";
import { getApplicationAccessToken } from "../../../utils";

export default async function handler(req, res) {
  const { subreddit, sorting = "hot", limit = 5, pageParam } = req.query;
  const token = await getToken({ req });
  let redditRes;
  if (token?.accessToken) {
    try {
      redditRes = await fetch(
        `https://oauth.reddit.com/r/${subreddit}/${sorting}.json?limit=${limit}&after=${pageParam}&raw_json=1`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
      res.status(200).json(await redditRes.json());
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  } else {
    try {
      const { access_token } = await getApplicationAccessToken();

      redditRes = await fetch(
        `https://oauth.reddit.com/r/${subreddit}/${sorting}.json?limit=${limit}&after=${pageParam}&raw_json=1`,
        {
          headers: {
            Authorization: `Bearer ${await access_token}`,
          },
        }
      );

      res.status(redditRes.status).json(await redditRes.json());
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}
