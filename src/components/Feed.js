import { Fragment } from "react";
import PostTile from "./PostTile";
import { Button, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  posts: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 800,
    [theme.fn.largerThan("sm")]: {
      gap: 8,
    },
  },
}));

function Feed({ posts, fetchNextPage, hasNextPage, isFetchingNextPage }) {
  const { classes } = useStyles();
  return (
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
  );
}

export default Feed;
