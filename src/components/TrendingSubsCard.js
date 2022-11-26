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
  subredditTile: {
    width: "100%",
    padding: "1rem 0",
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
    <>
      <Title color="dimmed" order={2} size={14} sx={{ padding: "0.75rem 0" }}>
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
    </>
  );
}

export default TrendingSubsCard;
