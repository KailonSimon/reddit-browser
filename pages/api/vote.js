import { getToken } from "next-auth/jwt";

export default async (req, res) => {
  const { id, direction } = JSON.parse(req.body);
  const token = await getToken({ req });
  if (!token) {
    res.status(403).json({ error: "Must be signed in to vote" });
  } else if (!id || req.method !== "POST") {
    res.status(400).json({ error: "Missing input values" });
    return;
  }
  const response = await fetch(
    `https://oauth.reddit.com/api/vote?id=${id}&dir=${direction}`,
    {
      method: "POST",
      headers: { Authorization: "Bearer " + token.accessToken },
    }
  );
  if (response.status === 200) {
    res
      .status(response.status)
      .json(
        `Successfully ${
          direction === 1
            ? "upvoted"
            : direction === -1
            ? "downvoted"
            : "unvoted"
        } post ${id}`
      );
  } else {
    res.status(response.status).end();
  }
};
