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
import React, { useEffect, useState } from "react";
import moment from "moment";
import Video from "./Video";

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

function PostCard({ post }) {
  const { classes } = useStyles();
  const [externalData, setExternalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!post.is_self && !post.post_hint == "image") {
      setIsLoading(true);
      encodeURIComponent();
      fetch(`/api/get-open-graph/${encodeURIComponent(post.url)}`)
        .then((res) => res.json())
        .then((data) => {
          setExternalData(data.result);
        })
        .finally(setIsLoading(false));
    }
  }, [post]);

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Text
          size="sm"
          weight="bold"
          component="a"
          href={`https://www.reddit.com/r/${post.subreddit}/`}
          target="_blank"
          rel="noreferrer"
          sx={(theme) => ({
            whiteSpace: "nowrap",
            ":hover": {
              cursor: "pointer",
              textDecoration: "underline",
              color: theme.colors.brand,
            },
          })}
        >
          r/{post.subreddit}
        </Text>
        <span style={{ margin: "0 4px", fontSize: 8 }}>•</span>
        <Text size="sm" sx={{ whiteSpace: "nowrap" }}>
          Posted by{" "}
          <Anchor
            href={`https://www.reddit.com/user/${post.author}`}
            target="_blank"
            rel="noreferrer"
            color="inherit"
            variant="text"
            sx={(theme) => ({
              ":hover": {
                cursor: "pointer",
                textDecoration: "underline",
                color: theme.colors.accent,
              },
            })}
          >
            u/{post.author}
          </Anchor>
        </Text>

        <Text size="sm" ml={4}>
          {moment.unix(post.created).fromNow()}
        </Text>
      </div>
      <Title
        order={1}
        style={{ fontSize: 20, fontFamily: "Chillax" }}
        variant="text"
      >
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
            styles={{
              root: {
                marginTop: 8,
                marginLeft: "auto",
                marginRight: "auto",
              },
            }}
          />
        ) : post.post_hint === "rich:video" ? (
          <Video content={post.secure_media_embed?.content} />
        ) : (
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
          >
            {isLoading ? (
              <Loader />
            ) : externalData?.ogImage?.url ? (
              <Image
                src={externalData.ogImage.url}
                alt={externalData.ogTitle}
                caption={
                  <Anchor
                    href={post.url}
                    mt={4}
                    size="sm"
                    target="_blank"
                    rel="noreferrer"
                    component="a"
                  >
                    {parseUrl(post.url).hostname}
                  </Anchor>
                }
              />
            ) : (
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
            )}
          </div>
        ))}
      {post.selftext && <Text mt={4}>{post.selftext}</Text>}
    </div>
  );
}

export default PostCard;
