import { createStyles, Title, Text, Anchor, Image, Badge } from "@mantine/core";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import React, { useEffect } from "react";
import { ClockHour3 } from "tabler-icons-react";
import moment from "moment";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  details: {
    display: "flex",
    alignItems: "center",
    flexFlow: "row wrap",
    margin: "0 0 4px",
  },
}));

function PostCard({ post }) {
  const { classes } = useStyles();
  useEffect(() => {
    console.log(post);
  }, [post]);

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Text size="sm" weight="bold" sx={{ whiteSpace: "nowrap" }}>
          r/{post.subreddit}
        </Text>
        <span style={{ margin: "0 4px", fontSize: 8 }}>•</span>
        <Text size="sm" sx={{ whiteSpace: "nowrap" }}>
          Posted by u/{post.author}
        </Text>

        <Text size="sm" ml={4}>
          {moment.unix(post.created).fromNow()}
        </Text>
      </div>

      <Title order={1} style={{ fontSize: 20 }}>
        {post.title}
      </Title>
      {post.link_flair_text && (
        <Badge
          variant="dot"
          size="md"
          mt={8}
          radius={4}
          sx={{ alignSelf: "flex-start" }}
        >
          {post.link_flair_text}
        </Badge>
      )}

      {!post.is_self &&
        (post.post_hint == "image" ? (
          <Image
            src={post.url}
            alt={post.title}
            styles={{ root: { marginTop: 8 } }}
          />
        ) : (
          <Anchor href={post.url} mt={4} size="sm">
            {parseUrl(post.url).hostname}
          </Anchor>
        ))}
      {post.selftext && <Text mt={4}>{post.selftext}</Text>}
    </div>
  );
}

export default PostCard;
