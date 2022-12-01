import { getApplicationAccessToken } from "../../../utils";

export default async function handler(req, res) {
  const { access_token } = await getApplicationAccessToken();
  if (access_token) {
    res.status(200).json(access_token);
  } else {
    res.status(500).end();
  }
}
