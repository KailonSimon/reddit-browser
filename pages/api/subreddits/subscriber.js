import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const token = await getToken({ req });
  if (token.accessToken) {
    try {
      const redditRes = await fetch(
        `https://oauth.reddit.com/subreddits/mine/subscriber`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
      console.log(await redditRes.json());
      res.status(200).json(await redditRes.json());
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}
