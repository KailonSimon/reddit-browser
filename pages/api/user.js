import { getToken } from "next-auth/jwt";
import { fetchAuthenticatedUserData } from "../../utils";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    const userData = await fetchAuthenticatedUserData(token.accessToken);
    res.status(200).json({ currentUser: userData });
  }
  res.end();
}
