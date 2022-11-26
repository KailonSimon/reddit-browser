import { useEffect, useState } from "react";
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import Head from "next/head";
import { Box, Text } from "@mantine/core";
import { mergePages, fetchPosts, getSubredditInfo } from "../../../utils";
import LoadingScreen from "../../../src/components/LoadingScreen";
import Feed from "../../../src/components/Feed/Feed";
import FeedControls from "../../../src/components/Feed/FeedControls";
import Layout from "../../../src/components/Layout";
import SubredditBanner from "../../../src/components/SubredditBanner";
import SubredditSidebar from "../../../src/components/SubredditSidebar";
import SidebarContainer from "../../../src/components/Navigation/SidebarContainer";
import SubredditRules from "../../../src/components/Subreddit/SubredditRules";

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
    ["posts", { subreddit }],
    ({ pageParam = "" }) =>
      fetchPosts(sorting, subreddit.display_name, 10, pageParam),
    {
      refetchOnMount: false,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.after;
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [sorting, refetch]);

  return status === "loading" ? (
    <LoadingScreen />
  ) : status === "error" ? (
    <Text>Error: {error.message}</Text>
  ) : (
    <Box
      sx={(theme) => ({
        width: "100%",
      })}
    >
      <Head>
        <title>{subreddit.display_name_prefixed}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={subreddit.display_name_prefixed} />
      </Head>
      <Layout>
        <SubredditBanner subreddit={subreddit} />
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            width: "100%",
            padding: "0 1rem",
          }}
        >
          <SidebarContainer>
            <SubredditSidebar subreddit={subreddit} />
            <SubredditRules subreddit={subreddit} />
          </SidebarContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
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
          </div>
        </div>
      </Layout>
    </Box>
  );
}

export default Subreddit;

export async function getServerSideProps(context) {
  const { subreddit } = context.query;
  const subredditInfo = await getSubredditInfo(subreddit);

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchInfiniteQuery(
      ["posts", { subreddit: subreddit[0] }],
      ({ pageParam = "" }) => fetchPosts("hot", subreddit[0], 5, pageParam),
      {
        getNextPageParam: (lastPage, pages) => {
          return lastPage.data.after;
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      subreddit: subredditInfo.data,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
