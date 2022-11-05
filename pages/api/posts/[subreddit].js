import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const { subreddit, sorting = "hot", limit = 5, pageParam } = req.query;
  const token = await getToken({ req });
  let redditRes;
  try {
    if (token) {
      redditRes = await fetch(
        `https://oauth.reddit.com/r/${subreddit}/${sorting}.json?limit=${limit}&after=${pageParam}&raw_json=1`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
      res.status(200).json(await redditRes.json());
    } else {
      redditRes = await fetch(
        `https://www.reddit.com/r/${subreddit}/${sorting}.json?limit=${limit}&after=${pageParam}&raw_json=1`
      );
      res.status(200).json(await redditRes.json());
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
