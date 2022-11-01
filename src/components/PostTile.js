import {
  Image,
  createStyles,
  Text,
  Anchor,
  Badge,
  Tooltip,
  Box,
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
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  container: {
    minHeight: 100,
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    padding: "0.5rem",
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-start",
    position: "relative",
    borderRadius: "4px",
  },
  upArrow: {
    "&:hover": { color: theme.colors.brand, cursor: "pointer" },
  },
  downArrow: {
    "&:hover": { color: theme.colors.accent, cursor: "pointer" },
  },
}));

function PostTile({ post, handlePostTileClick }) {
  const { classes } = useStyles();
  const router = useRouter();

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
        <Text
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark" ? "rgb(215, 218, 220)" : theme.black,
          })}
        >
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
            <Anchor
              weight={700}
              component="a"
              underline={false}
              variant="text"
              sx={(theme) => ({
                wordWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                textOverflow: "ellipsis",
                overflowWrap: "break-word",
                color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
              })}
              onClick={() => handlePostTileClick(post)}
            >
              {post.title}
            </Anchor>

            {post.over_18 && (
              <Badge ml={8} variant="filled" radius={4} color="red">
                NSFW
              </Badge>
            )}
            {post.link_flair_text && (
              <Tooltip
                label={post.link_flair_text}
                transition="skew-down"
                styles={(theme) => ({
                  tooltip: {
                    color:
                      theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
                    border: `1px solid ${
                      theme.colorScheme === "dark" ? "#474748" : "#1A1A1B"
                    }`,
                    backgroundColor:
                      theme.colorScheme === "dark" ? "#121212" : theme.white,
                  },
                })}
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
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            marginTop: 2,
            flexFlow: "row wrap",
            color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
          })}
        >
          {router.pathname === "/" && (
            <>
              <Link href={`/sub/${post.subreddit}`} passHref>
                <Anchor
                  size="sm"
                  variant="text"
                  weight="bold"
                  sx={(theme) => ({
                    whiteSpace: "nowrap",
                    color:
                      theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
                    ":hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: theme.colors.brand,
                    },
                  })}
                >
                  r/{post.subreddit}
                </Anchor>
              </Link>
              <span
                style={{ margin: "0 4px", fontSize: "6px", color: "#818384" }}
              >
                •
              </span>
            </>
          )}
          <Text
            size="xs"
            sx={(theme) => ({
              color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
            })}
          >
            Posted by{" "}
            <Anchor
              href={`/user/${post.author}`}
              target="_blank"
              rel="noreferrer"
              sx={(theme) => ({
                color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
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
              color: "inherit",
            }}
          >
            <ClockHour3 size={10} />
            <Text>{getRelativeTime(post.created)}</Text>
          </span>
        </Box>
        <Box
          sx={(theme) => ({
            marginTop: "4px",
            display: "flex",
            alignItems: "center",
            color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
          })}
        >
          <Messages size={16} />
          <Text size="xs" ml={2}>
            {numeral(post.num_comments).format("0a")} comment
            {post.num_comments === 1 ? "" : "s"}
          </Text>
        </Box>
      </div>
    </div>
  );
}

export default PostTile;
