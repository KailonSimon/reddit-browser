import { useRouter } from "next/router";
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
import { ClockHour3, Messages, Pinned, Speakerphone } from "tabler-icons-react";
import numeral from "numeral";
import Link from "next/link";
import { getRelativeTime } from "../../utils";
import SubmissionMenu from "./SubmissionMenu";
import SubmissionVotingControls from "./SubmissionVotingControls";

const useStyles = createStyles((theme) => ({
  container: {
    minHeight: 100,
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    padding: "0.5rem",
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-start",
    position: "relative",
    borderRadius: "4px",
  },
}));

function PostTile({ post, handlePostTileClick }) {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <Box
      className={classes.container}
      sx={(theme) => ({
        border: post.stickied
          ? `2px solid ${theme.colors.brand[6]}`
          : `1px solid ${
              theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
            }`,
      })}
    >
      <SubmissionVotingControls type="post" submission={post} />
      {post.preview?.images[0]?.source.url && (
        <Image
          withPlaceholder
          src={post.preview.images[0]?.source.url}
          alt={post.title}
          height={72}
          width={96}
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
            {post.stickied && (
              <Pinned
                color="#59ba12ff"
                size={20}
                style={{ position: "relative", top: 4, marginRight: 4 }}
              />
            )}
            <Text
              weight={700}
              sx={(theme) => ({
                wordWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                textOverflow: "ellipsis",
                overflowWrap: "break-word",
                marginRight: 8,
                cursor: "pointer",
                display: "inline",
                color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
              })}
              onClick={() => handlePostTileClick(post)}
            >
              {post.title}
            </Text>

            {post.over_18 && (
              <Badge mr={8} variant="filled" radius={4} color="red">
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
                <Badge variant="dot" radius={4}>
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
                color:
                  post.distinguished === "moderator"
                    ? theme.colors.brand
                    : theme.colorScheme === "dark"
                    ? "#D7DADC"
                    : theme.black,
                ":hover": {
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: theme.colors.brand,
                },
              })}
            >
              {post.stickied && (
                <Speakerphone
                  size={16}
                  color="#59ba12ff"
                  style={{ position: "relative", top: 4, marginRight: 2 }}
                />
              )}
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
    </Box>
  );
}

export default PostTile;
