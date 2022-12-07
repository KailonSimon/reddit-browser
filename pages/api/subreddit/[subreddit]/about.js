import { getToken } from "next-auth/jwt";
import { getSubredditInfo } from "../../../../utils";

export default async function handler(req, res) {
  const { subreddit } = req.query;

  const token = await getToken({ req });

  const subredditInfo = await getSubredditInfo(subreddit, token?.accessToken);

  if (subredditInfo) {
    res.status(200).json(subredditInfo);
  } else {
    res.status(500).end();
  }
}
