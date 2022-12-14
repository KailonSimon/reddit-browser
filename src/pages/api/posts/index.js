import { getToken } from "next-auth/jwt";
import winston, { createLogger } from "winston";

const logger = createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "reddit-api-service" },
});

async function makeRedditRequest(accessToken, sorting, limit, pageParam) {
  const url = `https://oauth.reddit.com/${sorting}?limit=${limit}&after=${pageParam}&raw_json=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit API returned a ${response.status} status code`);
    }

    return response.json();
  } catch (error) {
    logger.error(`Error making Reddit request: ${error.message}`);
    throw error;
  }
}

export default async function handler(req, res) {
  const { sorting, limit, pageParam } = req.query;
  const token = await getToken({ req });

  if (token?.accessToken) {
    try {
      const response = await makeRedditRequest(
        token.accessToken,
        sorting,
        limit,
        pageParam
      );
      res.status(200).json(response);
    } catch (error) {
      logger.error(error);
      res.status(500).end();
    }
  } else {
    res.status(403).end();
  }
}
