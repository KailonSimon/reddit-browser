import { getApplicationAccessToken } from "../../utils";

export default async function handler(req, res) {
  const { subreddit, type } = req.query;
  const { access_token } = await getApplicationAccessToken();

  try {
    let redditRes;
    switch (type) {
      case "link":
        redditRes = await fetch(
          `https://oauth.reddit.com/r/${subreddit}/api/link_flair_v2`,
          {
            headers: {
              Authorization: `Bearer ${await access_token}`,
            },
          }
        );
        let data = await redditRes.json();
        console.log(data.json);
        res.status(200).json(redditRes);
        break;
      default:
        res.status(500).end;
        break;
    }
  } catch (error) {
    console.error(error);
  }
}
