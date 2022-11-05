import { useEffect, useRef, useState, useReducer } from "react";
import { useInView } from "framer-motion";
import PostTile from "./PostTile";
import { createStyles, Loader, Text } from "@mantine/core";
import { useRouter } from "next/router";

import Head from "next/head";
import { openContextModal } from "@mantine/modals";
import { useSession } from "next-auth/react";

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

function Feed({ posts, fetchNextPage, hasNextPage }) {
  const { classes } = useStyles();
  const ref = useRef();
  const isInView = useInView(ref);
  const [openPost, setOpenPost] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    /*fetch("/api/posts/nba")
      .then((res) => res.json())
      .then((data) => console.log(data));*/
  }, [session]);

  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, fetchNextPage, hasNextPage]);

  const handlePostTileClick = (post) => {
    setOpenPost(post);
    openContextModal({
      modal: "post",
      innerProps: {
        post,
        closeModal: handleCloseModal,
      },
      styles: {
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
      },
      withCloseButton: false,
      transition: "slide-right",
      padding: "1rem 0",
      overlayOpacity: 0.65,
      overlayBlur: 3,
    });
  };
  const handleCloseModal = () => {
    setOpenPost("");
  };

  return (
    <>
      {openPost && (
        <Head>
          <title>{openPost.title}</title>
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
    </>
  );
}

export default Feed;
