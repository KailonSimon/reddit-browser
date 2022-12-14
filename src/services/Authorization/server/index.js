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

export const refreshAccessToken = async (token) => {
  try {
    const url =
      "https://www.reddit.com/api/v1/access_token" +
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};
