import {
  Image,
  createStyles,
  Text,
  Anchor,
  Badge,
  Tooltip,
} from "@mantine/core";
import React from "react";
import {
  ArrowBigDown,
  ArrowBigTop,
  ClockHour3,
  Messages,
} from "tabler-icons-react";
import numeral from "numeral";
import Link from "next/link";
import { getRelativeTime } from "../../utils";
import SubmissionMenu from "./SubmissionMenu";

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

function PostTile({ post, setSubreddit }) {
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
      {post.preview?.images[0]?.source.url && (
        <Image
          withPlaceholder
          src={post.preview.images[0]?.source.url}
          alt={post.title}
          height={75}
          width={75}
          radius={4}
          styles={{
            placeholder: { background: "#1A1A1B" },
            image: { border: "1px solid #474748" },
          }}
        />
      )}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              flex: 1,
              paddingRight: "0.5rem",
            }}
          >
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
                  whiteSpace: "pre-line",
                  textOverflow: "ellipsis",
                  overflowWrap: "break-word",
                }}
              >
                {post.title}
              </Anchor>
            </Link>
            {post.over_18 && (
              <Badge ml={8} variant="filled" radius={4} color="red">
                NSFW
              </Badge>
            )}
            {post.link_flair_text && (
              <Tooltip
                label={post.link_flair_text}
                transition="skew-down"
                styles={{
                  tooltip: {
                    border: "1px solid #474748",
                    background: "#1A1A1B",
                  },
                }}
              >
                <Badge ml={8} variant="dot" radius={4}>
                  {post.link_flair_text.length > 15
                    ? post.link_flair_text.substr(0, 15) + "..."
                    : post.link_flair_text}
                </Badge>
              </Tooltip>
            )}
          </div>
          <SubmissionMenu type="post" submission={post} />
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
                  color: theme.colors.brand,
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
            <Text>{getRelativeTime(post.created)}</Text>
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
