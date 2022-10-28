import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import LoadingScreen from "../../src/components/LoadingScreen";
import { mergePages } from "../../utils";
import Feed from "../../src/components/Feed";
import FeedControls from "../../src/components/FeedControls";
import Layout from "../../src/components/Layout";
import { Text } from "@mantine/core";

function Subreddit() {
  const router = useRouter();
  const { subreddit } = router.query;
  const [currentSubreddit, setSubreddit] = useState(subreddit);
  const [sorting, setSorting] = useState("hot");

  const fetchPosts = async ({ pageParam = "" }) => {
    let res;

    res = await fetch(
      `https://www.reddit.com/r/${subreddit}/${sorting}.json?limit=25&after=${pageParam}`
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
  }, [subreddit, sorting, refetch]);

  return status === "loading" ? (
    <LoadingScreen />
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
          subreddit={currentSubreddit}
          setSubreddit={setSubreddit}
          sorting={sorting}
          setSorting={setSorting}
          isRefetching={isRefetching}
        />

        <Feed
          key={mergePages(data.pages)}
          setSubreddit={setSubreddit}
          posts={mergePages(data.pages)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </Layout>
    </>
  );
}

export default Subreddit;
