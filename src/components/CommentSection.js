import {
  Button,
  createStyles,
  Loader,
  SegmentedControl,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { useReducer } from "react";
import CommentTile from "./CommentTile";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../utils";
import CommentSectionControls from "./CommentSectionControls";

const useStyles = createStyles((theme) => ({
  container: {
    border: "1px solid red",
    width: "100%",
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 0.5rem",
    color: "#C1C2C5",
    border: "1px solid #474748",
    background: "#1A1A1B",
    borderRadius: 4,
  },
}));

const initialState = {
  commentSorting: "confidence",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "SET_LOADING_COMMENTS":
      return { ...state, loadingComments: action.payload };
    case "SET_COMMENT_SORTING":
      return { ...state, commentSorting: action.payload };
    default:
      return initialState;
  }
}

function CommentSection({ post, commentId }) {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { isLoading, isFetching, isRefetching, data, refetch } = useQuery(
    ["comments", state.commentSorting],
    () => fetchComments(post.id, state.commentSorting, commentId),
    { enabled: !!post.id, initialData: [] }
  );

  const handleChangeCommentSort = (value) => {
    dispatch({ type: "SET_COMMENT_SORTING", payload: value });
  };

  return (
    <div className={classes.container}>
      <>
        <CommentSectionControls
          post={post}
          isLoading={isLoading}
          isFetching={isFetching}
          isRefetching={isRefetching}
          handleChangeCommentSort={handleChangeCommentSort}
          commentId={commentId}
        />
        {data[1]?.data.children?.length ? (
          <>
            {data[1].data.children.map((comment) => (
              <CommentTile comment={comment.data} key={comment.data.id} />
            ))}
          </>
        ) : isLoading || isFetching || isRefetching ? (
          <Loader />
        ) : (
          <Text color="dimmed">No Comments</Text>
        )}
      </>
    </div>
  );
}

export default CommentSection;
