import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const { sorting, limit, pageParam } = req.query;
  const token = await getToken({ req });
  let redditRes;

  if (token?.accessToken) {
    try {
      redditRes = await fetch(
        `https://oauth.reddit.com/${sorting}?limit=${limit}&after=${pageParam}&raw_json=1`,
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
    res.status(403).end();
  }
}
