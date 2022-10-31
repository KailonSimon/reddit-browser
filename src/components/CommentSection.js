import {
  Button,
  createStyles,
  Loader,
  SegmentedControl,
  Text,
} from "@mantine/core";
import Link from "next/link";
import React, { useEffect } from "react";
import CommentTile from "./CommentTile";

const useStyles = createStyles((theme) => ({
  container: {
    border: "1px solid red",
    width: "100%",
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 0.5rem",
    color: "#C1C2C5",
    border: "1px solid #474748",
    background: "#1A1A1B",
    borderRadius: 4,
  },
}));

function CommentSection({
  post,
  comments,
  setCommentSorting,
  isLoading,
  isFetching,
  isRefetching,
  type,
}) {
  const { classes } = useStyles();

  useEffect(() => {
    setCommentSorting("confidence");
  }, [post]);

  return (
    <div className={classes.container}>
      <>
        {type === "full" ? (
          <div
            style={{
              width: "100%",
              padding: "0.5rem 0",
            }}
          >
            <SegmentedControl
              fullWidth
              color="brand"
              radius={4}
              label={
                <Text color="#D7DADC" mb={4}>
                  Sort By
                </Text>
              }
              data={[
                { value: "confidence", label: "Best" },
                { value: "top", label: "Top" },
                { value: "new", label: "New" },
                { value: "random", label: "Random" },
              ]}
              onChange={(value) => setCommentSorting(value)}
              styles={(theme) => ({
                root: { border: "1px solid #474748" },
              })}
              disabled={isLoading || isFetching || isRefetching}
            />
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <Text color="brand" weight="bold">
              Viewing single comment thread
            </Text>
            <Link href={`/post/${post.id}`} passHref>
              <Button component="a" variant="outline">
                View all comments
              </Button>
            </Link>
          </div>
        )}
        {comments?.length ? (
          <>
            {comments.map((comment) => (
              <CommentTile comment={comment.data} key={comment.data.id} />
            ))}
          </>
        ) : isLoading || isFetching || isRefetching ? (
          <Loader />
        ) : (
          <Text color="dimmed">No Comments</Text>
        )}
      </>
    </div>
  );
}

export default CommentSection;
