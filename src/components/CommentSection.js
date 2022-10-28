import { createStyles, Divider, Loader, Text } from "@mantine/core";
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

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://www.reddit.com/comments/${postId}.json?limit=50&depth=4&sort=top`
    )
      .then((res) => res.json())
      .then((data) => {
        setComments(data[1].data.children);
      })
      .finally(() => setIsLoading(false));
  }, [postId]);
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <>
        <Text
          align="left"
          weight="bold"
          color="#D7DADC"
          sx={{ width: "100%", marginLeft: 8 }}
        >
          Top Comments
        </Text>
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
