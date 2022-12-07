import React from "react";
import { Avatar, Button, createStyles, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  selectDemoUser,
  subscribeToSubreddit,
  unsubscribeFromSubreddit,
} from "src/store/DemoUserSlice";
import { useAppDispatch } from "src/store/store";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme) => ({
  subredditTile: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "1rem 0.5rem",
    display: "flex",
    color: "#fff",
    borderRadius: 4,
    ":hover": {
      background: theme.colors.dark[6],
    },
  },
}));

function TrendingSubsCard({ trendingSubreddits, subscribedSubreddits }) {
  const { classes } = useStyles();
  const { data: session } = useSession();
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {trendingSubreddits.map((subreddit, i) => (
            <div className={classes.subredditTile} key={subreddit.id}>
              <Link href={`/sub/${subreddit.display_name}`} passHref>
                <div
                  style={{
                    display: "flex",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ marginRight: "1rem" }}>{i + 1}.</span>
                  <Avatar
                    src={subreddit.community_icon}
                    size="sm"
                    radius={99}
                    mr={8}
                    color="brand"
                  >
                    /r
                  </Avatar>
                  <Text size="sm">{subreddit.display_name_prefixed}</Text>
                </div>
              </Link>
              {(session &&
                subscribedSubreddits?.includes(subreddit.display_name)) ||
              demoUser.subscribedSubreddits.includes(subreddit.display_name) ? (
                <Button
                  size="xs"
                  variant="outline"
                  radius={99}
                  onClick={
                    session
                      ? null
                      : () =>
                          dispatch(
                            unsubscribeFromSubreddit(subreddit.display_name)
                          )
                  }
                >
                  Joined
                </Button>
              ) : (
                <Button
                  size="xs"
                  radius={99}
                  onClick={
                    session
                      ? null
                      : () =>
                          dispatch(subscribeToSubreddit(subreddit.display_name))
                  }
                >
                  Join
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TrendingSubsCard;
