import { Button, createStyles, Divider, Loader, Text } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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

function CommentSection({ post, comments, isLoading, type }) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <>
        {type === "full" ? (
          <Text
            align="left"
            weight="bold"
            color="#D7DADC"
            sx={{ width: "100%", marginLeft: 8 }}
          >
            Top Comments
          </Text>
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
        {comments.length ? (
          <>
            {comments.map((comment) => (
              <CommentTile comment={comment.data} key={comment.data.id} />
            ))}
          </>
        ) : isLoading ? (
          <Loader />
        ) : (
          <Text color="dimmed">No Comments</Text>
        )}
      </>
    </div>
  );
}

export default CommentSection;
