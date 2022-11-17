import {
  createStyles,
  Title,
  Text,
  Anchor,
  Image,
  Badge,
  Box,
} from "@mantine/core";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import React from "react";
import Video from "./Video";
import { getRelativeTime } from "../../utils";
import SubmissionMenu from "./SubmissionMenu";
import { useRouter } from "next/router";
import Link from "next/link";
import SubmissionVotingControls from "./SubmissionVotingControls";
import { Speakerphone } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    color: "#D7DADC",
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    borderRadius: 4,
    padding: "12px 42px 12px 12px",
    gap: "0.5rem",
    width: "100%",
    minWidth: 600,
    maxWidth: 800,
    [theme.fn.smallerThan(800)]: {
      minWidth: 300,
      maxWidth: "calc(100vw - 2rem)",
    },
  },
  details: {
    display: "flex",
    alignItems: "center",
    flexFlow: "row wrap",
    margin: "0 0 4px",
  },
  imageRoot: { marginTop: 8, marginLeft: "auto", marginRight: "auto" },
  image: {
    maxHeight: "calc(100vh - 20rem)",
    [theme.fn.smallerThan("xs")]: {
      maxHeight: "calc(100vh - 14rem)",
    },
  },
}));

function PostCard({ post }) {
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
      <div>
        <SubmissionVotingControls type="post" submission={post} />
      </div>
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className={classes.details}>
            {router.pathname === "/" && (
              <>
                <Link href={`/sub/${post.subreddit}`} passHref>
                  <Anchor
                    size="sm"
                    variant="text"
                    weight="bold"
                    color="#D7DADC"
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
                <span style={{ margin: "0 4px", fontSize: 8 }}>•</span>
              </>
            )}
            <Text
              size="sm"
              sx={(theme) => ({
                color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
                whiteSpace: "nowrap",
              })}
            >
              Posted by{" "}
              <Anchor
                href={`/user/${post.author}`}
                target="_blank"
                rel="noreferrer"
                color="inherit"
                variant="text"
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

            <Text
              size="sm"
              ml={4}
              sx={(theme) => ({
                color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
              })}
            >
              {getRelativeTime(post.created)} ago
            </Text>
          </div>
          <div style={{ position: "absolute", right: 16, marginLeft: 8 }}>
            <SubmissionMenu type="post" submission={post} />
          </div>
        </div>
        <Box
          sx={(theme) => ({
            display: "flex",
            flexFlow: "row wrap",
            color: theme.colorScheme === "dark" ? "#D7DADC" : theme.black,
          })}
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
        </Box>

        {post.post_hint === "self" && post?.preview?.images[0]?.source?.url ? (
          <Image
            src={post?.preview?.images[0]?.source?.url}
            alt={post.title}
            classNames={{ root: classes.imageRoot, image: classes.image }}
            fit="contain"
          />
        ) : post.post_hint == "image" ? (
          <Image
            src={post.url}
            alt={post.title}
            classNames={{ root: classes.imageRoot, image: classes.image }}
            fit="contain"
          />
        ) : post.post_hint === "rich:video" ? (
          <Video type="external" content={post.secure_media_embed?.content} />
        ) : post.post_hint === "hosted:video" ? (
          <Video type="hosted" content={post.media.reddit_video.fallback_url} />
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
            {post.selftext}
          </Text>
        )}
      </div>
    </Box>
  );
}

export default PostCard;
