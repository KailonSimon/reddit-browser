import { getToken } from "next-auth/jwt";
import { getApplicationAccessToken } from "src/services/Authorization/server";
import winston, { createLogger } from "winston";

const logger = createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "reddit-api-service" },
  transports: [new winston.transports.Console()],
});

async function makeRedditRequest(
  accessToken,
  subreddit,
  sorting,
  limit,
  pageParam
) {
  const url = `https://oauth.reddit.com/r/${subreddit}/${sorting}?limit=${limit}&after=${pageParam}&raw_json=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Reddit API call to ${url} returned a ${response.status} status code`
      );
    }

    return response;
  } catch (error) {
    logger.error(`Error making Reddit request: ${error.message}`);
    throw error;
  }
}

async function getAccessToken(req) {
  const userAccessToken = getToken({ req })?.accessToken;

  if (userAccessToken) {
    return userAccessToken;
  }

  return (await getApplicationAccessToken()).access_token;
}

export default async function handler(req, res) {
  const { subreddit, sorting = "hot", limit = 5, pageParam } = req.query;

  try {
    const accessToken = await getAccessToken(req);
    const redditRes = await makeRedditRequest(
      accessToken,
      subreddit,
      sorting,
      limit,
      pageParam
    );
    res.status(redditRes.status).json(await redditRes.json());
  } catch (error) {
    res.status(500).end();
  }
}
