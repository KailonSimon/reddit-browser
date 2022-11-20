import React, { useEffect } from "react";
import {
  Avatar,
  createStyles,
  Divider,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getTrendingSubreddits } from "../../utils";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  container: {
    height: "min-content",
    minHeight: "120px",
    width: "20rem",
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    padding: "00 0",
    display: "flex",
    flexDirection: "column",

    position: "relative",
    borderRadius: "4px",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    marginLeft: "1.5rem",

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
  subredditTile: {
    width: "100%",
    padding: "1.25rem",
    display: "flex",
    color: "#fff",
    ":hover": {
      cursor: "pointer",
      background: theme.colors.dark[6],
    },
  },
}));

function TrendingSubsCard() {
  const { classes } = useStyles();
  const {
    isLoading,
    isError,
    data: subreddits,
    error,
  } = useQuery({
    queryKey: ["trending subreddits"],
    queryFn: () => getTrendingSubreddits(5),
  });

  return (
    <div className={classes.container}>
      <Title color="dimmed" order={2} size={14} sx={{ padding: "0.75rem" }}>
        Trending Subreddits
      </Title>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Text>Error loading subreddits: {error}</Text>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {subreddits.data.children?.map((subreddit, i) => (
              <Link
                href={`/sub/${subreddit.data.display_name}`}
                key={subreddit.data.id}
                passHref
              >
                <div className={classes.subredditTile}>
                  <span style={{ marginRight: "1rem" }}>{i + 1}.</span>
                  <Avatar
                    src={subreddit.data.community_icon}
                    size="sm"
                    radius={99}
                    mr={8}
                    color="brand"
                  >
                    /r
                  </Avatar>
                  <Text>{subreddit.data.display_name_prefixed}</Text>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrendingSubsCard;
