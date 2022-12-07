import { v4 as uuidv4 } from "uuid";

export const fetchComments = async ({ postId, commentId, sorting }) => {
  const res = await fetch(
    `/api/comments/${postId}?commentId=${commentId}&sorting=${sorting}`
  );
  return await res.json();
};

export const fetchMoreChildrenComments = async (childrenIds) => {
  const res = await fetch(
    `https://api.pushshift.io/reddit/comment/search?ids=${childrenIds}`
  );
  return await res.json();
};

export const createDemoComment = (subreddit_id, subreddit, body, depth) => {
  const id = uuidv4();
  return {
    subreddit_id,
    subreddit,
    author_flair_template_id: null,
    likes: true,
    replies: {
      kind: "Listing",
      data: {
        after: null,
        dist: null,
        modhash: "",
        geo_filter: "",
        children: [],
        before: null,
      },
    },
    id,
    author: "DemoUser",
    created_utc: Math.floor(Date.now() / 1000),
    score: 0,
    author_fullname: "",
    all_awardings: [],
    body,
    name: `t1_${id}`,
    is_submitter: false,
    downs: 0,
    body_html: body,
    gildings: {},
    distinguished: null,
    stickied: false,
    author_flair_text_color: null,
    score_hidden: false,
    locked: false,
    created: Math.floor(Date.now() / 1000),
    author_flair_text: null,
    controversiality: 0,
    depth,
    author_flair_background_color: null,
    ups: 0,
  };
};

export const getNestedCommentClass = (depth) => {
  return depth % 5;
};
