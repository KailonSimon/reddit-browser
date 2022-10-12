import PostTile from "./PostTile";
import { Button, createStyles, Modal } from "@mantine/core";
import PostCard from "./PostCard";
import { useRouter } from "next/router";
import CommentSection from "./CommentSection";
import Link from "next/link";
import { ArrowLeft } from "tabler-icons-react";
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

  return (
    <>
      {router.query.post && (
        <>
          <Head>
            <title>
              {
                posts.find((post) => post.data.id == router.query.post).data
                  .title
              }
            </title>
          </Head>
          <Modal
            opened
            centered
            size="xl"
            withCloseButton={false}
            overlayOpacity={0.65}
            overlayBlur={3}
            padding="md"
            onClose={() => router.push("/", undefined, { scroll: false })}
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
          </Modal>
        </>
      )}
      <div className={classes.posts}>
        {posts.map((post) => (
          <PostTile key={post.data.id} post={post.data} />
        ))}
        <Button
          my={8}
          onClick={fetchNextPage}
          disabled={!hasNextPage}
          style={{ width: 250, alignSelf: "center" }}
          size="lg"
          loading={isFetchingNextPage}
        >
          {hasNextPage
            ? isFetchingNextPage
              ? "Loading More..."
              : "Load More"
            : "Nothing more to load"}
        </Button>
      </div>
    </>
  );
}

export default Feed;
