import { useEffect, useRef, useState, useReducer, useCallback } from "react";
import { useInView } from "framer-motion";
import PostTile from "./PostTile";
import { Button, createStyles, Loader, Modal, Text } from "@mantine/core";
import PostCard from "./PostCard";
import { useRouter } from "next/router";
import CommentSection from "./CommentSection";
import Link from "next/link";
import { ArrowLeft } from "tabler-icons-react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../utils";

const useStyles = createStyles((theme) => ({
  posts: {
    display: "flex",
    flexDirection: "column",
    width: 600,
    maxWidth: "100%",
    gap: 8,
    height: "100%",
    padding: "0 0 2rem",
  },
}));

const initialState = {
  comments: [],
  loadingComments: true,
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

function Feed({ posts, fetchNextPage, hasNextPage, setSubreddit }) {
  const { classes } = useStyles();
  const router = useRouter();
  const ref = useRef();
  const isInView = useInView(ref);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, fetchNextPage, hasNextPage]);

  const {
    isLoading,
    isFetching,
    isRefetching,
    data: comments,
    refetch,
  } = useQuery(
    ["comments"],
    () => fetchComments(router.query.post, state.commentSorting),
    { enabled: !!router.query.post, initialData: [] }
  );

  useEffect(() => {
    if (router.query.post) {
      refetch();
    }
  }, [router.query.post, state.commentSorting]);

  return (
    <>
      {router.query.post && (
        <Head>
          <title>
            {posts.find((post) => post.data.id == router.query.post).data.title}
          </title>
        </Head>
      )}
      <div className={classes.posts}>
        {posts.map((post) => (
          <PostTile
            key={post.data.id}
            post={post.data}
            setSubreddit={setSubreddit}
          />
        ))}
        <div
          ref={ref}
          style={{
            width: "100%",
            height: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {hasNextPage ? (
            <Loader />
          ) : (
            <Text color="dimmed">No more posts to show...</Text>
          )}
        </div>
      </div>
      <Modal
        opened={router.query.post}
        size="xl"
        withCloseButton={false}
        overlayOpacity={0.65}
        overlayBlur={3}
        padding="md"
        onClose={() => router.push("/", undefined, { scroll: false })}
        transition="slide-right"
        styles={{
          modal: {
            background: "transparent",
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
          },
          body: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "flex-start",
          },
        }}
      >
        {router.query.post && (
          <>
            <Link href={"/"} passHref scroll={false}>
              <Button component="a" variant="subtle" leftIcon={<ArrowLeft />}>
                Return to feed
              </Button>
            </Link>
            <PostCard
              setSubreddit={setSubreddit}
              post={
                posts.find((post) => post.data.id == router.query.post).data
              }
            />

            <CommentSection
              post={
                posts.find((post) => post.data.id == router.query.post).data
              }
              comments={comments[1]?.data?.children}
              isLoading={isLoading}
              isFetching={isFetching}
              isRefetching={isRefetching}
              type="full"
              setCommentSorting={(value) =>
                dispatch({ type: "SET_COMMENT_SORTING", payload: value })
              }
            />
          </>
        )}
      </Modal>
    </>
  );
}

export default Feed;
