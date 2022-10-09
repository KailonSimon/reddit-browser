import { Image, createStyles, Text, Anchor } from "@mantine/core";
import React, { useEffect } from "react";
import {
  ArrowBigDown,
  ArrowBigTop,
  ClockHour3,
  Messages,
} from "tabler-icons-react";
import moment from "moment/moment";
import numeral from "numeral";

const useStyles = createStyles((theme) => ({
  container: {
    minHeight: 100,
    border: "thin solid #818384",
    background: "#1A1A1B",
    padding: "0.5rem",
    display: "flex",
    gap: "1rem",
    [theme.fn.largerThan("sm")]: {
      borderRadius: "8px",
    },
  },
  upArrow: {
    "&:hover": { color: "#FF8b60", cursor: "pointer" },
  },
  downArrow: {
    "&:hover": { color: "#9494FF", cursor: "pointer" },
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
        }}
      >
        <ArrowBigTop size={20} className={classes.upArrow} />
        <Text color="rgb(215, 218, 220)">
          {numeral(post.score).format("0a")}
        </Text>
        <ArrowBigDown size={20} className={classes.downArrow} />
      </div>
      <Image
        withPlaceholder
        src={post.url}
        height={75}
        width={75}
        styles={{ placeholder: { background: "#1A1A1B" } }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Text weight={700}>{post.title}</Text>
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
              href={`https://www.reddit.com/user/${post.author}`}
              target="_blank"
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
