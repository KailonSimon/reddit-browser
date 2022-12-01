import {
  createStyles,
  Text,
  Textarea,
  Anchor,
  Button,
  Skeleton,
} from "@mantine/core";
import { useReducer } from "react";
import CommentTile from "./CommentTile";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../../utils";
import CommentSectionControls from "./CommentSectionControls";
import { useSession } from "next-auth/react";
import { selectAuthentication } from "../../../store/AuthSlice";
import { useSelector } from "react-redux";
import Link from "next/link";
import ErrorBoundary from "../ErrorBoundary";

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
    case "SET_COMMENT_INPUT":
      return { ...state, commentInput: action.payload };
    default:
      return initialState;
  }
}

function CommentSection({ post, commentId }) {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    commentSorting: post.suggested_sort || "confidence",
    ...initialState,
  });
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

  const authentication = useSelector(selectAuthentication);

  return (
    <ErrorBoundary>
      <div className={classes.container}>
        <>
          {session ||
            (authentication.status === "demo" && (
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
                      <Link
                        href={
                          authentication.status === "demo"
                            ? `/user/demouserid`
                            : `/user/${session.user.name}`
                        }
                        passHref
                      >
                        <Anchor>
                          {authentication.status === "demo"
                            ? "DemoUser"
                            : session.user.name}
                        </Anchor>
                      </Link>
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
            ))}
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
                  <CommentTile comment={comment.data} key={comment.data.id} />
                );
              })}
            </>
          ) : (
            <Text color="dimmed" py={24}>
              No Comments
            </Text>
          )}
        </>
      </div>
    </ErrorBoundary>
  );
}

export default CommentSection;
