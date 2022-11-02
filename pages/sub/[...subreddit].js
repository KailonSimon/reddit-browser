import { useState } from "react";
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import Head from "next/head";
import { Text, Title } from "@mantine/core";
import { mergePages, fetchPosts } from "../../utils";
import LoadingScreen from "../../src/components/LoadingScreen";
import Feed from "../../src/components/Feed";
import FeedControls from "../../src/components/FeedControls";
import Layout from "../../src/components/Layout";

function Subreddit({ subreddit }) {
  const [sorting, setSorting] = useState("hot");

  const {
    status,
    data,
    error,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["posts", { subreddit, sorting }],
    ({ pageParam = "" }) => fetchPosts(sorting, subreddit, pageParam),
    {
      refetchOnMount: false,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.after;
      },
    }
  );

  return status === "loading" ? (
    <LoadingScreen />
  ) : status === "error" ? (
    <Text>Error: {error.message}</Text>
  ) : (
    <>
      <Head>
        <title>Reddit Browser | {subreddit}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="Reddit Browser | Home" />
      </Head>
      <Layout>
        <Title mb={16} color="brand" order={1} align="center">
          r/{subreddit}
        </Title>
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

  const queryClient = new QueryClient();

  try {
    await queryClient.fetchInfiniteQuery(
      ["posts", { sorting: "hot" }],
      ({ pageParam = "" }) => fetchPosts("hot", subreddit[0], 5, pageParam)
    );
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      subreddit: subreddit[0],
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
