import {
  Avatar,
  Button,
  createStyles,
  Image,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectDemoUser,
  subscribeToSubreddit,
  unsubscribeFromSubreddit,
} from "../../store/DemoUserSlice";
import { useAppDispatch } from "../../store/store";

const useStyles = createStyles((theme) => ({
  container: {
    margin: "4rem 0 0.5rem",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  imageWrapper: {
    width: "100%",
    maxHeight: "15vh",
    overflow: "hidden",
  },
  image: {
    maxHeight: "15vh",
  },
  bannerPlaceholder: {
    height: "15vh",
  },
  details: {
    padding: "0 1rem",
    display: "flex",
    alignItems: "start",
    gap: "1rem",
    position: "relative",
    background: "#1A1A1B",
    marginBottom: "0.5rem",
  },
}));

function SubredditBanner({ subreddit }) {
  const { classes } = useStyles();
  const demoUser = useSelector(selectDemoUser);
  const [subscribeButtonHovered, setSubscribeButtonHovered] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className={classes.container}>
      {subreddit.banner_background_image ? (
        <div className={classes.imageWrapper}>
          <Image
            src={subreddit.banner_background_image}
            alt={subreddit.title}
            styles={{
              root: {
                position: "relative",
                top: "100%",
              },
            }}
            classNames={{ image: classes.image }}
          />
        </div>
      ) : (
        <div className={classes.imageWrapper}>
          <div
            className={classes.bannerPlaceholder}
            style={{
              backgroundColor: subreddit.banner_background_color || "#030303",
            }}
          />
        </div>
      )}
      <div className={classes.details}>
        <Avatar
          src={subreddit.community_icon || subreddit.icon_img}
          alt={subreddit.display_name}
          radius={99}
          size={80}
          color="brand"
          sx={(theme) => ({
            border: `4px solid ${theme.colors.brand[6]}`,
            position: "relative",
            top: -16,
            background: "#030303",
          })}
        >
          /r
        </Avatar>

        <div style={{ padding: "0.5rem 0" }}>
          <Link href={`/sub/${subreddit.display_name}`} passHref>
            <Title
              order={1}
              variant="text"
              color="white"
              size={28}
              weight="bold"
              sx={{ lineHeight: "32px", cursor: "pointer" }}
            >
              {subreddit.title}
            </Title>
          </Link>
          <Text color="dimmed" size={14}>
            {subreddit.display_name_prefixed}
          </Text>
        </div>
        <div style={{ padding: "0.5rem 0" }}>
          {demoUser.subscribedSubreddits.includes(subreddit.display_name) ? (
            <Button
              size="xs"
              radius={99}
              variant="outline"
              sx={{ minWidth: "6rem", minHeight: "2rem" }}
              onClick={() =>
                dispatch(unsubscribeFromSubreddit(subreddit.display_name))
              }
              onMouseOver={() => setSubscribeButtonHovered(true)}
              onMouseOut={() => setSubscribeButtonHovered(false)}
            >
              {subscribeButtonHovered ? "Leave" : "Joined"}
            </Button>
          ) : (
            <Button
              size="xs"
              radius={99}
              sx={{ minWidth: "6rem", minHeight: "2rem" }}
              onClick={() =>
                dispatch(subscribeToSubreddit(subreddit.display_name))
              }
            >
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubredditBanner;
