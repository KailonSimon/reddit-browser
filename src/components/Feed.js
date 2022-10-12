import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import PostTile from "./PostTile";
import { Button, createStyles, Loader, Modal, Text } from "@mantine/core";
import PostCard from "./PostCard";
import { useRouter } from "next/router";
import CommentSection from "./CommentSection";
import Link from "next/link";
import { ArrowLeft, ArrowUp } from "tabler-icons-react";
import Head from "next/head";

const useStyles = createStyles((theme) => ({
  posts: {
    display: "flex",
    flexDirection: "column",
    width: 600,
    maxWidth: "100%",
    gap: 8,
    height: "100%",
  },
}));

function Feed({ posts, fetchNextPage, hasNextPage, isFetchingNextPage }) {
  const { classes } = useStyles();
  const router = useRouter();
  const ref = useRef();
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView && hasNextPage) {
      fetchNextPage();
    }
  }, [isInView]);

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
          <PostTile key={post.data.id} post={post.data} />
        ))}
        <div
          ref={ref}
          style={{
            width: "100%",
            height: 50,
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
              post={
                posts.find((post) => post.data.id == router.query.post).data
              }
            />
            <CommentSection postId={router.query.post} />
          </>
        )}
      </Modal>
    </>
  );
}

export default Feed;
