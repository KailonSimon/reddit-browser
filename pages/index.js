import { Fragment, useEffect, useState } from "react";
import { Button, createStyles, Loader, Text, Title } from "@mantine/core";
import PostTile from "../src/components/PostTile";
import { useInfiniteQuery } from "@tanstack/react-query";

import FeedControls from "../src/components/FeedControls";
import Feed from "../src/components/Feed";

const useStyles = createStyles((theme) => ({
  container: {
    padding: "0 0.5rem",
    [theme.fn.largerThan("xs")]: {
      padding: "0 1rem",
    },
  },
  posts: {
    display: "flex",
    flexDirection: "column",
    [theme.fn.largerThan("sm")]: {
      gap: 8,
    },
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const [subreddits, setSubreddits] = useState([
    "LearnProgramming",
    "ProgrammerHumor",
    "WebDev",
    "WorldNews",
    "Futurology",
    "Science",
  ]);
  const [sorting, setSorting] = useState("hot");

  const fetchPosts = async ({ pageParam = "" }) => {
    const res = await fetch(
      `https://www.reddit.com/r/${subreddits.join(
        "+"
      )}/${sorting}.json?limit=25&after=${pageParam}`
    );
    return res.json();
  };

  const {
    status,
    data,
    error,
    refetch,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(["posts"], fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.after;
    },
  });

  useEffect(() => {
    refetch();
  }, [subreddits, sorting, refetch]);

  return status === "loading" ? (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader />
    </div>
  ) : status === "error" ? (
    <Text>Error: {error.message}</Text>
  ) : (
    <>
      <div className={classes.container}>
        <div
          style={{
            padding: "1rem 0",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Title
            align="center"
            mb={16}
            sx={{ fontFamily: "Chillax" }}
            color="brand"
          >
            Reddit<span>B</span>rowser
          </Title>

          <FeedControls
            subreddits={subreddits}
            setSubreddits={setSubreddits}
            sorting={sorting}
            setSorting={setSorting}
            isRefetching={isRefetching}
          />

          <Feed
            posts={data.pages}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      </div>
    </>
  );
}
