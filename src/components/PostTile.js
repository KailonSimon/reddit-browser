import { Image, createStyles, Text, Anchor, Badge } from "@mantine/core";
import React from "react";
import {
  ArrowBigDown,
  ArrowBigTop,
  ClockHour3,
  Messages,
} from "tabler-icons-react";
import moment from "moment";
import numeral from "numeral";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  container: {
    minHeight: 100,
    border: "1px solid #474748",
    background: "#1A1A1B",
    padding: "0.5rem",
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-start",
    position: "relative",
    borderRadius: "4px",
    "&:hover": {
      border: "1px solid #D7DADC",
    },
  },
  upArrow: {
    "&:hover": { color: theme.colors.brand, cursor: "pointer" },
  },
  downArrow: {
    "&:hover": { color: theme.colors.accent, cursor: "pointer" },
  },
}));

function PostTile({ post }) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <div
        style={{
          color: "#818384",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 30,
          minWidth: 30,
        }}
      >
        <ArrowBigTop size={20} className={classes.upArrow} />
        <Text color="rgb(215, 218, 220)">
          {numeral(post.score).format("0a")}
        </Text>
        <ArrowBigDown size={20} className={classes.downArrow} />
      </div>
      {post.post_hint && post.post_hint === "image" ? (
        <Image
          withPlaceholder
          src={post.url}
          alt={post.title}
          height={75}
          width={75}
          radius={4}
          styles={{
            placeholder: { background: "#1A1A1B" },
            image: { border: "1px solid #474748" },
          }}
        />
      ) : post.post_hint === "rich:video" ? (
        <Image
          withPlaceholder
          src={post.media?.oembed?.thumbnail_url}
          alt={post.title}
          height={75}
          width={75}
          radius={4}
          styles={{
            placeholder: { background: "#1A1A1B" },
            image: { border: "1px solid #474748" },
          }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: "1 1 auto",
          maxWidth:
            post.post_hint === "image"
              ? "calc(100% - 121px)"
              : "calc(100% - 38px)",
        }}
      >
        <div>
          <div>
            <Link
              href={`/?post=${post.id}`}
              as={`/post/${post.id}`}
              scroll={false}
              passHref
            >
              <Anchor
                weight={700}
                component="a"
                underline={false}
                variant="text"
                color="#D7DADC"
                sx={{
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  textOverflow: "ellipsis",
                  overflowWrap: "break-word",
                }}
              >
                {post.title}
              </Anchor>
            </Link>
            {post.link_flair_text && (
              <Badge ml={4} variant="dot" sx={{ maxWidth: "85%" }}>
                {post.link_flair_text}
              </Badge>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 2,
            flexFlow: "row wrap",
          }}
        >
          <Text
            size="xs"
            weight="bold"
            sx={(theme) => ({
              ":hover": {
                cursor: "pointer",
                textDecoration: "underline",
                color: theme.colors.brand,
              },
            })}
          >
            <a
              href={`https://www.reddit.com/r/${post.subreddit}/`}
              target="_blank"
              rel="noreferrer"
            >
              r/{post.subreddit}
            </a>
          </Text>
          <span style={{ margin: "0 4px", fontSize: "6px", color: "#818384" }}>
            •
          </span>
          <Text color="dimmed" size="xs">
            Posted by{" "}
            <Anchor
              href={`/user/${post.author}`}
              target="_blank"
              rel="noreferrer"
              color="dimmed"
              sx={(theme) => ({
                ":hover": {
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: theme.colors.accent,
                },
              })}
            >
              {post.author}
            </Anchor>
          </Text>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 4,
              fontSize: "12px",
              gap: 2,
              color: "#868e96",
            }}
          >
            <ClockHour3 size={10} />
            <Text>{moment.unix(post.created).fromNow()}</Text>
          </span>
        </div>
        <div
          style={{ marginTop: "4px", display: "flex", alignItems: "center" }}
        >
          <Messages size={16} color="#868e96" />
          <Text color="dimmed" size="xs" ml={2}>
            {numeral(post.num_comments).format("0a")} comment
            {post.num_comments === 1 ? "" : "s"}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default PostTile;
