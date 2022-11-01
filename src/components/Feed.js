import { useEffect, useRef, useState, useReducer, useCallback } from "react";
import { useInView } from "framer-motion";
import PostTile from "./PostTile";
import { Button, createStyles, Loader, Modal, Text } from "@mantine/core";
import PostCard from "./PostCard";
import { useRouter } from "next/router";
import CommentSection from "./CommentSection";
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
  postModalOpen: false,
  currentlyOpenPost: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "SET_LOADING_COMMENTS":
      return { ...state, loadingComments: action.payload };
    case "SET_COMMENT_SORTING":
      return { ...state, commentSorting: action.payload };
    case "SET_POST_MODAL_OPEN":
      return { ...state, postModalOpen: action.payload };
    case "SET_CURRENTLY_OPEN_POST":
      return { ...state, currentlyOpenPost: action.payload };
    default:
      return initialState;
  }
}

function Feed({ posts, fetchNextPage, hasNextPage }) {
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

  const handlePostTileClick = (post) => {
    dispatch({ type: "SET_CURRENTLY_OPEN_POST", payload: post });
    if (router.pathname === "/") {
      router.push(`/?post=${post.id}`, `/post/${post.id}`, {
        scroll: false,
      });
    }
    dispatch({ type: "SET_POST_MODAL_OPEN", payload: true });
  };
  const handleCloseModal = () => {
    if (router.pathname === "/") {
      router.push("/", undefined, { scroll: false });
    }
    dispatch({ type: "SET_CURRENTLY_OPEN_POST", payload: null });
    dispatch({ type: "SET_POST_MODAL_OPEN", payload: false });
  };

  return (
    <>
      {state.currentlyOpenPost && (
        <Head>
          <title>{state.currentlyOpenPost.title}</title>
        </Head>
      )}
      <div className={classes.posts}>
        {posts.map((post) => (
          <PostTile
            key={post.data.id}
            post={post.data}
            handlePostTileClick={handlePostTileClick}
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
        opened={state.postModalOpen}
        size="xl"
        withCloseButton={false}
        overlayOpacity={0.65}
        overlayBlur={3}
        padding="md"
        onClose={handleCloseModal}
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

            paddingTop: "0.5rem",
          },
        }}
      >
        {state.currentlyOpenPost && (
          <>
            <Button
              variant="subtle"
              leftIcon={<ArrowLeft />}
              onClick={handleCloseModal}
            >
              Return to feed
            </Button>

            <PostCard post={state.currentlyOpenPost} />

            <CommentSection post={state.currentlyOpenPost} />
          </>
        )}
      </Modal>
    </>
  );
}

export default Feed;
