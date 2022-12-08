import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectVisitedPosts } from "src/store/DemoUserSlice";
import { Pinned, Speakerphone } from "tabler-icons-react";
import SubmissionMenu from "../SubmissionMenu";
import SubmissionVotingControls from "../SubmissionVotingControls";
import AwardsContainer from "../AwardsContainer";
import FlairContainer from "../FlairContainer";
import { createStyles, Text, Badge, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { getRelativeTime } from "src/services/Format/Date";
import { condenseNumber } from "src/services/Format/API";

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
  const isMobile = useMediaQuery("(max-width: 700px)");
  const visitedPosts = useSelector(selectVisitedPosts);

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
        gap: "0.5rem",
      })}
    >
      {variant !== "condensed" && !isMobile ? (
        <div style={{ marginRight: 4 }}>
          <SubmissionVotingControls variant="vertical" submission={post} />
        </div>
      ) : null}
      {post.preview?.images[0]?.source.url && (
        <div
          style={{
            position: "relative",
            height: isMobile ? 52 : variant === "condensed" ? 48 : 72,
            minHeight: isMobile ? 52 : variant === "condensed" ? 48 : 72,
            width: isMobile ? 70 : variant === "condensed" ? 64 : 96,
            minWidth: isMobile ? 70 : variant === "condensed" ? 64 : 96,
            borderRadius: 4,
            overflow: "hidden",
            marginRight: "0.5rem",
          }}
        >
          <Image
            src={post.preview.images[0]?.source.url}
            alt={post.title}
            fill
            sizes="100%"
            style={{
              objectFit: "cover",
              filter: post.spoiler ? "blur(25px)" : "",
            }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          maxWidth: "100%",
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
            {post.stickied && variant !== "condensed" && (
              <Pinned
                color="#59ba12ff"
                size={20}
                style={{ position: "relative", top: 4, marginRight: 4 }}
              />
            )}
            <Text
              weight={500}
              sx={(theme) => ({
                overflowWrap: "break-word",
                marginRight: 8,
                cursor: "pointer",
                display: "inline",
                color:
                  visitedPosts.some(
                    (visitedPost) => visitedPost.id === post.id
                  ) && variant !== "condensed"
                    ? "#909296"
                    : theme.colorScheme === "dark"
                    ? "#D7DADC"
                    : theme.black,
                position: "relative",
                top: variant === "condensed" ? -6 : 0,

                lineHeight: variant === "condensed" ? "18px" : "20px",

                ":hover": {
                  textDecoration:
                    variant === "condensed" ? "underline" : "none",
                },
              })}
              size={variant === "condensed" ? 14 : 16}
              onClick={() => handlePostTileClick(post)}
            >
              {post.title}
            </Text>
            {post.over_18 && (
              <Badge size="xs" mr={8} variant="filled" radius={4} color="red">
                NSFW
              </Badge>
            )}
            {variant !== "condensed" ? (
              <div
                style={{
                  display: "inline",
                  verticalAlign: "bottom",
                  marginRight: 8,
                }}
              >
                <FlairContainer submission={post} type="link" />
              </div>
            ) : null}

            {variant !== "condensed" && post.spoiler && (
              <Badge size="xs" mr={8} variant="outline" radius={4} color="gray">
                spoiler
              </Badge>
            )}
          </div>
        </div>
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            flexFlow: "row wrap",
            color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
            marginTop: variant === "condensed" ? 0 : 4,
          })}
        >
          {router.pathname === "/" && variant !== "condensed" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link href={`/sub/${post.subreddit}`} passHref>
                <Text
                  size="sm"
                  weight={700}
                  sx={(theme) => ({
                    whiteSpace: "nowrap",
                    marginRight: 3,
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
            </div>
          )}
          {variant !== "condensed" ? (
            <>
              <Text
                size="xs"
                sx={(theme) => ({
                  color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
                  display: "flex",
                  gap: 2,
                  marginRight: 4,
                })}
              >
                Posted by{" "}
                <Link href={`/user/${post.author}`} passHref>
                  <Text
                    sx={(theme) => ({
                      marginRight: 3,
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
                {getRelativeTime(post.created)} ago
              </Text>
              <AwardsContainer awards={post.all_awardings} />
            </>
          ) : null}
        </Box>
        {variant !== "condensed" ? (
          <SubmissionMenu
            type="post"
            submission={post}
            handleCommentButtonClick={() => handlePostTileClick(post)}
          />
        ) : (
          <Box
            sx={(theme) => ({
              display: "block",
              fontSize: 12,
              color: theme.colorScheme === "dark" ? "#818384" : theme.black,
            })}
          >
            <span>{condenseNumber(post.score)} points</span>
            <span className={classes.condensedDetailsItem}>
              {condenseNumber(post.num_comments)} comment
              {post.num_comments === 1 ? "" : "s"}
            </span>
            <span className={classes.condensedDetailsItem}>
              {getRelativeTime(post.created)}
            </span>
          </Box>
        )}
      </div>
    </Box>
  );
}

export default PostTile;
