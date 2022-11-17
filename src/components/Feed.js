import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import PostTile from "./PostTile";
import { createStyles, Skeleton, Text } from "@mantine/core";
import Head from "next/head";
import { openContextModal } from "@mantine/modals";

const useStyles = createStyles((theme) => ({
  posts: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "100%",
    gap: 8,
    height: "100%",
    padding: "0 0 2rem",
  },
  modal: {
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    width: "fit-content",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    alignItems: "flex-start",
    paddingTop: "0.5rem",
    width: "fit-content",
  },
  modalInner: {
    [theme.fn.smallerThan("xs")]: {
      padding: "3rem 0.5rem",
    },
  },
}));

function Feed({ posts, fetchNextPage, hasNextPage }) {
  const { classes } = useStyles();
  const ref = useRef();
  const isInView = useInView(ref);
  const [openPost, setOpenPost] = useState(null);

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
      classNames: {
        modal: classes.modal,
        body: classes.modalBody,
        inner: classes.modalInner,
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {hasNextPage ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: "0.5rem",
              }}
            >
              {[...Array(10)].map((x, i) => (
                <Skeleton
                  height={100}
                  width="100%"
                  radius={4}
                  key={i}
                  className={classes.skeleton}
                />
              ))}
            </div>
          ) : (
            <Text color="dimmed">No more posts to show...</Text>
          )}
        </div>
      </div>
    </>
  );
}

export default Feed;
