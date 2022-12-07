export const getApplicationAccessToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    const res = await fetch("https://www.reddit.com/api/v1/access_token", {
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};
