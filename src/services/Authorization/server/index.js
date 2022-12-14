export const getApplicationAccessToken = async () => {
  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");

  const headers = {
    Authorization: `Basic ${Buffer.from(
      `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
    ).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    body,
    headers,
    method: "POST",
  });
  return await res.json();
};
