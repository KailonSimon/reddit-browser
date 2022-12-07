import { getApplicationAccessToken } from "src/services/Authorization/server";

export default async function handler(req, res) {
  const data = await getApplicationAccessToken();

  if (data.access_token) {
    res.status(200).json(data.access_token);
  } else {
    res.status(500).end();
  }
}
