import { useEffect, useState } from "react";
import { createStyles, Loader, Text, Title } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";

import FeedControls from "../src/components/FeedControls";
import Feed from "../src/components/Feed";
import Layout from "../src/components/Layout";
import Head from "next/head";

export default function Home() {
  const [subreddit, setSubreddit] = useState(null);
  const [sorting, setSorting] = useState("hot");

  const fetchPosts = async ({ pageParam = "" }) => {
    let res;
    if (subreddit) {
      res = await fetch(
        `https://www.reddit.com/r/${subreddit}/${sorting}.json?limit=25&after=${pageParam}`
      );
    } else {
      res = await fetch(
        `https://www.reddit.com/r/all/${sorting}.json?limit=25&after=${pageParam}`
      );
    }
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
  }, [subreddit, sorting, refetch]);

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
      <Head>
        <title>Reddit Browser | Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="Reddit Browser | Home" />
      </Head>
      <Layout>
        <FeedControls
          subreddit={subreddit}
          setSubreddit={setSubreddit}
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
    </>
  );
}
