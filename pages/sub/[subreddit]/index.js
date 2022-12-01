import { useEffect, useState } from "react";
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import Head from "next/head";
import { createStyles, Box, Text } from "@mantine/core";
import { mergePages, fetchPosts, getSubredditInfo } from "../../../utils";
import LoadingScreen from "../../../src/components/LoadingScreen";
import Feed from "../../../src/components/Feed/Feed";
import FeedControls from "../../../src/components/Feed/FeedControls";
import Layout from "../../../src/components/Layout";
import SubredditBanner from "../../../src/components/SubredditBanner";
import SubredditSidebar from "../../../src/components/SubredditSidebar";
import SidebarContainer from "../../../src/components/Navigation/SidebarContainer";
import SubredditRules from "../../../src/components/Subreddit/SubredditRules";
import ContentWarningModal from "../../../src/components/Modals/ContentWarningModal";
import { wrapper } from "../../../store/store";

const useStyles = createStyles((theme) => ({
  content: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    width: "100%",
    padding: "0 1rem",
    [theme.fn.smallerThan("md")]: {
      padding: "0 0.5rem",
    },
  },
}));

function Subreddit({ subreddit }) {
  const { classes } = useStyles();
  const [sorting, setSorting] = useState("hot");
  const [contentWarningModalOpen, setContentWarningModalOpen] = useState(
    subreddit.over18
  );

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
    ({ pageParam }) =>
      fetchPosts(sorting, subreddit.display_name, 10, pageParam),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.after;
      },
    }
  );
  const handleCloseModal = () => {
    setContentWarningModalOpen(false);
  };

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
      <>
        <Layout>
          <SubredditBanner subreddit={subreddit} />
          <div className={classes.content}>
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
        <ContentWarningModal
          open={contentWarningModalOpen}
          handleCloseModal={handleCloseModal}
        />
      </>
    </Box>
  );
}

export default Subreddit;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { subreddit } = context.query;
    const subredditInfo = await getSubredditInfo(subreddit);

    return {
      props: {
        subreddit: subredditInfo.data,
      },
    };
  }
);
