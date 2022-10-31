import {
  createStyles,
  Title,
  Text,
  Anchor,
  Image,
  Badge,
  Loader,
} from "@mantine/core";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import React, { useEffect } from "react";
import Video from "./Video";
import { getRelativeTime } from "../../utils";
import SubmissionMenu from "./SubmissionMenu";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    color: "#D7DADC",
    border: "1px solid #474748",
    background: "#1A1A1B",
    borderRadius: 4,
    padding: "1rem",
    width: "100%",
  },
  details: {
    display: "flex",
    alignItems: "center",
    flexFlow: "row wrap",
    margin: "0 0 4px",
  },
}));

function PostCard({ post, setSubreddit }) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className={classes.details}>
          <Text
            size="sm"
            weight="bold"
            sx={(theme) => ({
              whiteSpace: "nowrap",
              ":hover": {
                cursor: "pointer",
                textDecoration: "underline",
                color: theme.colors.brand,
              },
            })}
            onClick={() => setSubreddit(post.subreddit)}
          >
            r/{post.subreddit}
          </Text>
          <span style={{ margin: "0 4px", fontSize: 8 }}>•</span>
          <Text size="sm" sx={{ whiteSpace: "nowrap" }}>
            Posted by{" "}
            <Anchor
              href={`/user/${post.author}`}
              target="_blank"
              rel="noreferrer"
              color="inherit"
              variant="text"
              sx={(theme) => ({
                ":hover": {
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: theme.colors.brand,
                },
              })}
            >
              u/{post.author}
            </Anchor>
          </Text>

          <Text size="sm" ml={4}>
            {getRelativeTime(post.created)} ago
          </Text>
        </div>
        <div style={{ marginLeft: 8 }}>
          <SubmissionMenu type="post" submission={post} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          alignItems: "center",
        }}
      >
        <Title
          order={1}
          mr={8}
          style={{
            fontSize: 20,
            fontFamily: "Chillax",
          }}
          variant="text"
        >
          {post.title}
        </Title>
        {post.over_18 && (
          <Badge
            variant="filled"
            color="red"
            mr={8}
            radius={4}
            sx={{ width: "min-content" }}
          >
            NSFW
          </Badge>
        )}
        {post.link_flair_text && (
          <Badge variant="dot" size="md" radius={4}>
            {post.link_flair_text}
          </Badge>
        )}
      </div>

      {post.post_hint === "self" && post?.preview?.images[0]?.source?.url ? (
        <Image
          src={post?.preview?.images[0]?.source?.url}
          alt={post.title}
          styles={{
            root: {
              marginTop: 8,
              marginLeft: "auto",
              marginRight: "auto",
            },
          }}
        />
      ) : post.post_hint == "image" ? (
        <Image
          src={post.url}
          alt={post.title}
          styles={{
            root: {
              marginTop: 8,
              marginLeft: "auto",
              marginRight: "auto",
            },
          }}
        />
      ) : post.domain === "streamable.com" ? (
        <Video type="external" content={post.media.oembed.html} />
      ) : post.post_hint === "rich:video" ? (
        <Video type="external" content={post.secure_media_embed?.content} />
      ) : post.post_hint === "hosted:video" ? (
        <Video type="hosted" content={post.media.reddit_video.fallback_url} />
      ) : (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
        >
          <Anchor
            href={post.url}
            mt={4}
            size="sm"
            target="_blank"
            rel="noreferrer"
            component="a"
            sx={{
              width: "100%",
              textAlign: "center",
            }}
          >
            {parseUrl(post.url).hostname}
          </Anchor>
        </div>
      )}
      {post.is_self && <Text mt={4}>{post.selftext}</Text>}
    </div>
  );
}

export default PostCard;
