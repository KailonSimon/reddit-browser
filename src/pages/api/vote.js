import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
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
    const redditRes = await fetch(
      `https://oauth.reddit.com/api/info/?id=${id}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token.accessToken },
      }
    );
    const updatedPost = await redditRes.json();

    res.status(response.status).json(updatedPost.data.children[0].data);
  } else {
    res.status(response.status).end();
  }
}
