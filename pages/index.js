import { useEffect, useState } from "react";
import { createStyles, Loader, Text, Title } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";

import FeedControls from "../src/components/FeedControls";
import Feed from "../src/components/Feed";
import Layout from "../src/components/Layout";

export default function Home() {
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
    <Layout>
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
    </Layout>
  );
}
