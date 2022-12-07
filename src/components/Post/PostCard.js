import {
  createStyles,
  Title,
  Text,
  Anchor,
  Badge,
  Box,
  Button,
  Tooltip,
} from "@mantine/core";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Video from "../Video";
import {
  createImageBlurData,
  getRelativeTime,
  getSubredditInfo,
  toBase64,
} from "../../../utils";
import SubmissionMenu from "../SubmissionMenu";
import { useRouter } from "next/router";
import Link from "next/link";
import SubmissionVotingControls from "../SubmissionVotingControls";
import { Speakerphone } from "tabler-icons-react";
import { markdown } from "snudown-js";
import AwardsContainer from "../AwardsContainer";
import FlairContainer from "../FlairContainer";
import { useMediaQuery } from "@mantine/hooks";
import SubredditSidebar from "../SubredditSidebar";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    color: "#D7DADC",

    padding: "0.75rem 0.5rem",
    gap: "0.5rem",
    width: "100%",
    minWidth: 600,
    maxWidth: 800,

    [theme.fn.smallerThan(800)]: {
      padding: "8px 21px 8px 8px",
      minWidth: 300,
    },
  },
  details: {
    display: "flex",
    alignItems: "center",
    flexFlow: "row wrap",
    margin: "0 0 4px",
  },
  imageWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 8,
    background: "#000",
    position: "relative",
  },
  image: {
    objectFit: "contain",
    maxWidth: "100%",
    maxHeight: "50vh",

    [theme.fn.smallerThan("sm")]: {
      maxHeight: "25vh",
    },
  },
  spoilerOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backdropFilter: "blur(50px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function PostCard({ post }) {
  const { classes } = useStyles();
  const [spoilerOverlayShown, setSpoilerOverlayShown] = useState(post.spoiler);
  const [subreddit, setSubreddit] = useState(null);
  const isMobile = useMediaQuery("(max-width: 700px)");

  function createMarkup() {
    return { __html: markdown(post.selftext, { target: "_blank" }) };
  }

  useEffect(() => {
    fetch(`/api/subreddit/${post.subreddit}/about`)
      .then((res) => res.json())
      .then((subreddit) => setSubreddit(subreddit.data));
  }, [post]);

  return (
    <Box className={classes.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          flex: 1,
        }}
      >
        {!isMobile ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 99,
            }}
          >
            <SubmissionVotingControls variant="vertical" submission={post} />
          </div>
        ) : null}
        <div
          style={{
            width: "100%",
            position: "relative",
            paddingLeft: isMobile ? 0 : "2.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              className={classes.details}
              style={{ paddingTop: isMobile ? "0.25rem" : 0 }}
            >
              <>
                <Link href={`/sub/${post.subreddit}`} passHref>
                  <div style={{ display: "flex" }}>
                    {subreddit?.community_icon || subreddit?.icon_img ? (
                      <Image
                        src={subreddit.community_icon || subreddit.icon_img}
                        alt={subreddit.title}
                        height={20}
                        width={20}
                        style={{
                          marginRight: 4,
                          background: subreddit.primary_color || "transparent",
                          borderRadius: "100%",
                        }}
                      />
                    ) : null}
                    <Tooltip
                      color="dark"
                      position="bottom"
                      styles={{
                        tooltip: {
                          padding: "1rem",
                          borderRadius: 4,
                          maxWidth: 400,
                          filter: "drop-shadow(0 0.2rem 0.25rem #000)",
                          zIndex: 98,
                        },
                      }}
                      label={
                        <SubredditSidebar
                          subreddit={subreddit}
                          variant="hover"
                        />
                      }
                    >
                      <Text
                        size="xs"
                        weight="bold"
                        color="#D7DADC"
                        sx={(theme) => ({
                          whiteSpace: "nowrap",
                          color:
                            theme.colorScheme === "dark"
                              ? "#D7DADC"
                              : theme.black,
                          ":hover": {
                            cursor: "pointer",
                            textDecoration: "underline",
                            color: theme.colors.brand,
                          },
                        })}
                      >
                        r/{post.subreddit}
                      </Text>
                    </Tooltip>
                  </div>
                </Link>
                <span style={{ margin: "0 4px", fontSize: 8 }}>•</span>
              </>
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
                    rel="noreferrer"
                    color="inherit"
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
              <Text
                size="xs"
                ml={4}
                sx={(theme) => ({
                  color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
                })}
              >
                {getRelativeTime(post.created)} ago
              </Text>
              <AwardsContainer awards={post.all_awardings} />
            </div>
          </div>
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              flexFlow: "row wrap",
              color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
            })}
          >
            <Title
              order={1}
              mr={8}
              size={20}
              mb={8}
              weight={700}
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
            <FlairContainer submission={post} type="link" />
          </Box>

          {post.is_self ? null : post.post_hint == "image" ? (
            <div className={classes.imageWrapper}>
              {spoilerOverlayShown ? (
                <div className={classes.spoilerOverlay}>
                  <Button
                    onClick={() => {
                      setSpoilerOverlayShown(false);
                    }}
                  >
                    CLICK TO SEE SPOILER
                  </Button>
                </div>
              ) : null}
              <Image
                src={post.url}
                alt={post.title}
                className={classes.image}
                width={post.preview.images[0].source.width}
                height={post.preview.images[0].source.height}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  createImageBlurData(
                    post.preview.images[0].source.width,
                    post.preview.images[0].source.height
                  )
                )}`}
                priority
              />
            </div>
          ) : post.post_hint === "rich:video" ? (
            <Video type="external" content={post.secure_media_embed?.content} />
          ) : post.post_hint === "hosted:video" ? (
            <Video
              type="hosted"
              content={post.media.reddit_video.fallback_url}
            />
          ) : post.preview?.images[0]?.source.url ? (
            <>
              <div className={classes.imageWrapper}>
                {spoilerOverlayShown ? (
                  <div className={classes.spoilerOverlay}>
                    <Button
                      onClick={() => {
                        setSpoilerOverlayShown(false);
                      }}
                    >
                      CLICK TO SEE SPOILER
                    </Button>
                  </div>
                ) : null}
                <Image
                  src={post.preview.images[0]?.source.url}
                  alt={post.title}
                  className={classes.image}
                  width={post.preview.images[0].source.width}
                  height={post.preview.images[0].source.height}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    createImageBlurData(
                      post.preview.images[0].source.width,
                      post.preview.images[0].source.height
                    )
                  )}`}
                  priority
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <Anchor href={post.url} target="_blank">
                  {post.domain}
                </Anchor>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 8,
              }}
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
          {post.is_self && (
            <Text
              mt={4}
              sx={(theme) => ({
                color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
              })}
            >
              {<div dangerouslySetInnerHTML={createMarkup()} />}
            </Text>
          )}
          <div>
            <SubmissionMenu
              type="post"
              submission={post}
              handleCommentButtonClick={() => {}}
            />
          </div>
        </div>
      </div>
    </Box>
  );
}

export default PostCard;
