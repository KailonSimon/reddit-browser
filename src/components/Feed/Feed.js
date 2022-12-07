import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useInView } from "framer-motion";
import { useSelector } from "react-redux";
import { useAppDispatch } from "src/store/store";
import { selectHiddenSubmissions, visitPost } from "src/store/DemoUserSlice";
import PostTile from "../Post/PostTile";
import CommentTile from "../Comment/CommentTile";
import ErrorBoundary from "../ErrorBoundary";
import { createStyles, Skeleton, Text } from "@mantine/core";
import { openContextModal, closeAllModals } from "@mantine/modals";

const useStyles = createStyles((theme) => ({
  submissions: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "100vw",
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

function Feed({
  submissions,
  fetchNextPage,
  hasNextPage,
  hiddenShown = false,
  variant = "full",
}) {
  const { classes } = useStyles();
  const ref = useRef();
  const isInView = useInView(ref);
  const [openPost, setOpenPost] = useState(null);
  const hiddenSubmissions = useSelector(selectHiddenSubmissions);
  const dispatch = useAppDispatch();

  const { events } = useRouter();

  const handleCloseModal = useCallback(() => {
    setOpenPost("");
  }, [setOpenPost]);

  const handlePostTileClick = (post) => {
    setOpenPost(post);
    dispatch(visitPost(post));
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

  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    events.on("routeChangeStart", closeAllModals);
    return () => {
      // unsubscribe to event on unmount to prevent memory leak
      events.off("routeChangeStart", closeAllModals);
    };
  }, [events]);

  return (
    <ErrorBoundary>
      {openPost && (
        <Head>
          <title>{openPost.title}</title>
        </Head>
      )}
      <div className={classes.submissions}>
        {submissions.map((post, i) => {
          if (
            hiddenSubmissions.some(
              (hiddenSubmission) => post.id === hiddenSubmission.id
            ) &&
            !hiddenShown
          ) {
            return null;
          }

          if (post.name.substring(0, 2) === "t1") {
            return (
              <CommentTile key={post.name} comment={post} variant="single" />
            );
          }

          return (
            <PostTile
              key={`${post.id + i}`}
              post={post}
              handlePostTileClick={handlePostTileClick}
            />
          );
        })}
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
          ) : variant === "full" ? (
            <Text color="dimmed" my={16}>
              {"There's nothing here..."}
            </Text>
          ) : null}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Feed;
