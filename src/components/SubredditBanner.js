import { Avatar, createStyles, Image, Text } from "@mantine/core";
import React from "react";

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
  },
  image: {
    height: "12rem",
    maxHeight: "15vh",
    [theme.fn.smallerThan("sm")]: {
      maxHeight: "6rem",
    },
  },
  details: {
    padding: "0 1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    position: "relative",
  },
}));

function SubredditBanner({ subreddit }) {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      {subreddit.banner_background_image && (
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
      )}
      <div
        className={classes.details}
        style={{
          padding: subreddit.banner_background_image ? "0 1rem" : "1rem",
        }}
      >
        <Avatar
          src={subreddit.icon_img}
          alt={subreddit.display_name}
          radius={99}
          size={80}
          color="brand"
          sx={(theme) => ({
            border: `4px solid ${theme.colors.brand[6]}`,
            position: "relative",
            top: subreddit.banner_background_image ? -16 : 0,
          })}
        >
          /r
        </Avatar>

        <div>
          <Text
            color="white"
            size={28}
            weight="bold"
            sx={{ lineHeight: "32px" }}
            mt={4}
          >
            {subreddit.title}
          </Text>
          <Text color="dimmed" size={14}>
            {subreddit.display_name_prefixed}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default SubredditBanner;
