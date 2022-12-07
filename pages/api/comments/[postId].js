import { getToken } from "next-auth/jwt";
import { getComments } from "../../../utils";

export default async function handler(req, res) {
  const token = await getToken({ req });
  const { postId, commentId, sorting } = req.query;

  const comments = await getComments({
    postId,
    sorting,
    commentId,
    accessToken: token?.accessToken,
  });

  if (comments) {
    res.status(200).json(comments);
  } else {
    res.status(500).end();
  }
}
