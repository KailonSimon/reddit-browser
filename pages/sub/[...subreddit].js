import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Head from "next/head";
import LoadingScreen from "../../src/components/LoadingScreen";
import { mergePages } from "../../utils";
import Feed from "../../src/components/Feed";
import FeedControls from "../../src/components/FeedControls";
import Layout from "../../src/components/Layout";
import { Text } from "@mantine/core";
import { fetchPosts } from "../../utils";

function Subreddit({ subreddit }) {
  const [sorting, setSorting] = useState("hot");

  const {
    status,
    data,
    error,
    refetch,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["posts"],
    ({ pageParam = "" }) => fetchPosts(sorting, subreddit, pageParam),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.after;
      },
    }
  );

  useEffect(() => {
    console.log(subreddit);
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
          sorting={sorting}
          setSorting={setSorting}
          isRefetching={isRefetching}
        />

        <Feed
          key={mergePages(data.pages)}
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

export async function getServerSideProps(context) {
  const { subreddit } = context.query;

  return { props: { subreddit: subreddit[0] } };
}
