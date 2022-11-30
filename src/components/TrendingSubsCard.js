import React from "react";
import {
  Avatar,
  Button,
  createStyles,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getTrendingSubreddits } from "../../utils";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  selectDemoUser,
  subscribeToSubreddit,
  unsubscribeFromSubreddit,
} from "../../store/DemoUserSlice";
import { useAppDispatch } from "../../store/store";

const useStyles = createStyles((theme) => ({
  subredditTile: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "1rem",
    display: "flex",
    color: "#fff",
    borderRadius: 4,
    ":hover": {
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

  const demoUser = useSelector(selectDemoUser);
  const dispatch = useAppDispatch();

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
              <div className={classes.subredditTile} key={subreddit.data.id}>
                <Link href={`/sub/${subreddit.data.display_name}`} passHref>
                  <div
                    style={{
                      display: "flex",
                      cursor: "pointer",
                    }}
                  >
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
                {demoUser.subscribedSubreddits.includes(
                  subreddit.data.display_name
                ) ? (
                  <Button
                    size="xs"
                    variant="outline"
                    radius={99}
                    onClick={() =>
                      dispatch(
                        unsubscribeFromSubreddit(subreddit.data.display_name)
                      )
                    }
                  >
                    Joined
                  </Button>
                ) : (
                  <Button
                    size="xs"
                    radius={99}
                    onClick={() =>
                      dispatch(
                        subscribeToSubreddit(subreddit.data.display_name)
                      )
                    }
                  >
                    Join
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TrendingSubsCard;
