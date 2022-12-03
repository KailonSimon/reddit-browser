import { createStyles, Text, Skeleton } from "@mantine/core";
import { useReducer } from "react";
import CommentTile from "./CommentTile";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../../utils";
import CommentSectionControls from "./CommentSectionControls";
import ErrorBoundary from "../ErrorBoundary";
import CommentReplyArea from "./CommentReplyArea";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    minWidth: 600,
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem",
    paddingTop: 0,
    [theme.fn.smallerThan(800)]: {
      minWidth: 300,
    },
  },
}));

const initialState = {
  commentInput: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_COMMENT_SORTING":
      return { ...state, commentSorting: action.payload };
    default:
      return initialState;
  }
}

function CommentSection({ post, commentId, variant = "full" }) {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    commentSorting: post.suggested_sort || "confidence",
    ...initialState,
  });

  const { isLoading, isFetching, isRefetching, data } = useQuery(
    ["comments", state.commentSorting],
    () => fetchComments(post.id, state.commentSorting, commentId),
    { enabled: !!post.id, initialData: [] }
  );

  const handleChangeCommentSort = (value) => {
    dispatch({ type: "SET_COMMENT_SORTING", payload: value });
  };

  return (
    <ErrorBoundary>
      <div className={classes.container} id="#comments">
        {variant === "full" ? <CommentReplyArea variant="link" /> : null}
        <CommentSectionControls
          post={post}
          isLoading={isLoading}
          isFetching={isFetching}
          isRefetching={isRefetching}
          commentSorting={state.commentSorting}
          handleChangeCommentSort={handleChangeCommentSort}
          commentId={commentId}
        />
        {isLoading || isFetching || isRefetching ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {[...Array(8)].map((x, i) => (
              <Skeleton height={75} width="100%" mb="xs" key={i} />
            ))}
          </div>
        ) : data[1]?.data.children?.length ? (
          <>
            {data[1].data.children.map((comment) => {
              return (
                <CommentTile
                  comment={comment.data}
                  key={comment.data.id}
                  variant="full"
                />
              );
            })}
          </>
        ) : (
          <Text color="dimmed" py={24}>
            No Comments
          </Text>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default CommentSection;
