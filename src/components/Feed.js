import { Fragment } from "react";
import PostTile from "./PostTile";
import { Button, createStyles, Modal } from "@mantine/core";
import PostCard from "./PostCard";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  posts: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 800,
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
        <Modal
          opened
          centered
          size="xl"
          withCloseButton={false}
          overlayOpacity={0.55}
          overlayBlur={3}
          onClose={() => router.push("/", undefined, { scroll: false })}
          styles={{ modal: { border: "1px solid #D7DADC", borderRadius: 4 } }}
        >
          <PostCard
            post={
              posts[0].data.children.find(
                (post) => post.data.id == router.query.post
              ).data
            }
          />
        </Modal>
      )}
      <div className={classes.posts}>
        {posts.map((group, i) => (
          <Fragment key={i}>
            {group.data.children.map((post) => (
              <PostTile key={post.data.id} post={post.data} />
            ))}
          </Fragment>
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
