import { useRouter } from "next/router";
import { createStyles, Text, Badge, Box } from "@mantine/core";
import Image from "next/image";
import React from "react";
import { Messages, Pinned, Speakerphone } from "tabler-icons-react";
import numeral from "numeral";
import Link from "next/link";
import { getCondensedDate, getRelativeTime } from "../../../utils";
import SubmissionMenu from "../SubmissionMenu";
import SubmissionVotingControls from "../SubmissionVotingControls";
import AwardsContainer from "../AwardsContainer";
import FlairContainer from "../FlairContainer";

const useStyles = createStyles((theme) => ({
  container: {
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    display: "flex",
    justifyContent: "flex-start",
    position: "relative",
    borderRadius: "4px",
  },
  condensedDetailsItem: {
    whiteSpace: "nowrap",
    ":before": {
      content: `'·'`,
      margin: 3,
    },
  },
}));

function PostTile({ post, handlePostTileClick, variant }) {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <Box
      className={classes.container}
      sx={(theme) => ({
        padding: variant === "condensed" ? ".75rem 0" : "0.5rem",
        border:
          variant === "condensed"
            ? ""
            : `1px solid ${
                theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
              }`,
        ":not(:last-child)": {
          borderBottom:
            variant === "condensed" ? `2px solid ${theme.colors.gray[8]}` : "",
        },
      })}
    >
      {variant !== "condensed" ? (
        <SubmissionVotingControls type="post" submission={post} />
      ) : null}
      {post.preview?.images[0]?.source.url && (
        <div
          style={{
            position: "relative",
            height: variant === "condensed" ? 48 : 72,
            minHeight: variant === "condensed" ? 48 : 72,
            width: variant === "condensed" ? 48 : 72,
            minWidth: variant === "condensed" ? 48 : 72,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Image
            src={post.preview.images[0]?.source.url}
            alt={post.title}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          marginLeft: variant === "condensed" ? "0.25rem" : "0.5rem",
          maxWidth:
            variant === "condensed"
              ? "100%"
              : post.post_hint === "image"
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
              weight={500}
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
                lineHeight: "18px",
                position: "relative",
                top: variant === "condensed" ? -6 : 0,
              })}
              size={variant === "condensed" ? 14 : 16}
              onClick={() => handlePostTileClick(post)}
            >
              {variant === "condensed" && post.title.length > 60
                ? `${post.title.substring(0, 60).trim()}...`
                : post.title}
            </Text>
            {post.over_18 && (
              <Badge size="xs" mr={8} variant="filled" radius={4} color="red">
                NSFW
              </Badge>
            )}
            {variant !== "condensed" ? (
              <FlairContainer submission={post} type="link" />
            ) : null}
          </div>
          {variant !== "condensed" ? (
            <SubmissionMenu type="post" submission={post} />
          ) : null}
        </div>
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            flexFlow: "row wrap",
            color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
          })}
        >
          {router.pathname === "/" && variant !== "condensed" && (
            <>
              <Link href={`/sub/${post.subreddit}`} passHref>
                <Text
                  size="sm"
                  weight={700}
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
                </Text>
              </Link>
              <span
                style={{
                  margin: "0 4px",
                  fontSize: "6px",
                  color: "#818384",
                }}
              >
                •
              </span>
            </>
          )}
          {variant !== "condensed" ? (
            <>
              <Text
                size="xs"
                sx={(theme) => ({
                  color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
                  display: "flex",
                  gap: 2,
                })}
              >
                Posted by{" "}
                <Link href={`/user/${post.author}`} passHref>
                  <Text
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
                  </Text>
                </Link>
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
                <Text>{getRelativeTime(post.created)} ago</Text>
                <AwardsContainer awards={post.all_awardings} />
              </span>
            </>
          ) : null}
        </Box>
        {variant !== "condensed" ? (
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
              {numeral(post.num_comments).format("0.[0]a")} comment
              {post.num_comments === 1 ? "" : "s"}
            </Text>
          </Box>
        ) : (
          <Box
            sx={(theme) => ({
              display: "block",
              fontSize: 12,
              color: theme.colorScheme === "dark" ? "#818384" : theme.black,
            })}
          >
            <span>{numeral(post.score).format("0a")} points</span>
            <span className={classes.condensedDetailsItem}>
              {numeral(post.num_comments).format("0.[0]a")} comment
              {post.num_comments === 1 ? "" : "s"}
            </span>
            <span className={classes.condensedDetailsItem}>
              {getCondensedDate(post.created)}
            </span>
          </Box>
        )}
      </div>
    </Box>
  );
}

export default PostTile;
