import {
  createStyles,
  Loader,
  Text,
  Textarea,
  Anchor,
  Button,
  Skeleton,
} from "@mantine/core";
import { useReducer } from "react";
import CommentTile from "./CommentTile";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../utils";
import CommentSectionControls from "./CommentSectionControls";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    minWidth: 600,
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 0.5rem",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    borderRadius: 4,
    [theme.fn.smallerThan(800)]: {
      minWidth: 300,
      maxWidth: "calc(100vw - 2rem)",
    },
  },
}));

const initialState = {
  commentSorting: "confidence",
  commentInput: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_COMMENT_SORTING":
      return { ...state, commentSorting: action.payload };
    case "SET_COMMENT_INPUT":
      return { ...state, commentInput: action.payload };
    default:
      return initialState;
  }
}

function CommentSection({ post, commentId }) {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: session } = useSession();

  const { isLoading, isFetching, isRefetching, data, refetch } = useQuery(
    ["comments", state.commentSorting],
    () => fetchComments(post.id, state.commentSorting, commentId),
    { enabled: !!post.id, initialData: [] }
  );

  const handleChangeCommentSort = (value) => {
    dispatch({ type: "SET_COMMENT_SORTING", payload: value });
  };

  const handleSubmitComment = () => {
    dispatch({ type: "SET_COMMENT_INPUT", payload: "" });
  };

  return (
    <div className={classes.container}>
      <>
        {session && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              padding: "0 8px 8px",
              gap: "0.5rem",
            }}
          >
            <Textarea
              label={
                <Text>
                  Comment as{" "}
                  <Anchor href={`/user/${session.user.name}`}>
                    {session.user.name}
                  </Anchor>
                </Text>
              }
              value={state.commentInput}
              onChange={(e) =>
                dispatch({
                  type: "SET_COMMENT_INPUT",
                  payload: e.currentTarget.value,
                })
              }
            />
            <Button
              size="xs"
              sx={{ alignSelf: "end" }}
              disabled={!state.commentInput || !session}
              onClick={handleSubmitComment}
            >
              Comment
            </Button>
          </div>
        )}
        <CommentSectionControls
          post={post}
          isLoading={isLoading}
          isFetching={isFetching}
          isRefetching={isRefetching}
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
              <Skeleton height={50} width="100%" mb="xs" key={i} />
            ))}
          </div>
        ) : data[1]?.data.children?.length ? (
          <>
            {data[1].data.children.map((comment) => (
              <CommentTile comment={comment.data} key={comment.data.id} />
            ))}
          </>
        ) : (
          <Text color="dimmed">No Comments</Text>
        )}
      </>
    </div>
  );
}

export default CommentSection;
