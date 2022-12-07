import { useEffect, useState, useReducer } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Head from "next/head";
import { createStyles, Box, Text } from "@mantine/core";
import { mergePages, fetchPosts } from "../../../utils";
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
import { useSelector } from "react-redux";
import { selectAuthentication } from "../../../store/AuthSlice";
import { getToken } from "next-auth/jwt";
import SubredditFlairFilter from "../../../src/components/Subreddit/SubredditFlairFilter";

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

const initialState = { sorting: "hot", shownFlair: [] };

function reducer(state, action) {
  switch (action.type) {
    case "SET_FLAIR_FILTER":
      return { ...state, shownFlair: action.payload };
    case "SET_SORTING":
      return { ...state, sorting: action.payload };
    default:
      throw new Error();
  }
}

function Subreddit({ subreddit, flairList }) {
  const { classes } = useStyles();
  const [contentWarningModalOpen, setContentWarningModalOpen] = useState(
    subreddit.over18
  );
  const authentication = useSelector(selectAuthentication);
  const [state, dispatch] = useReducer(reducer, initialState);

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
      fetchPosts(subreddit.display_name, state.sorting, 10, pageParam),
    {
      enabled: authentication.status !== "unauthenticated",
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
  }, [state.sorting, refetch]);

  return status === "loading" ? (
    <LoadingScreen />
  ) : status === "error" ? (
    <Text>Error: {error.message}</Text>
  ) : (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Head>
        <title>{subreddit.display_name_prefixed}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={subreddit.display_name_prefixed} />
      </Head>
      <>
        <Layout>
          <SubredditBanner subreddit={subreddit} />
          <Box className={classes.content}>
            <SidebarContainer>
              <SubredditSidebar subreddit={subreddit} />
              {flairList.length ? (
                <SubredditFlairFilter
                  flairList={flairList}
                  setFlairFilter={(values) =>
                    dispatch({ type: "SET_FLAIR_FILTER", payload: values })
                  }
                  shownFlair={state.shownFlair}
                />
              ) : null}
              <SubredditRules subreddit={subreddit} />
            </SidebarContainer>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <FeedControls
                sorting={state.sorting}
                setSorting={(value) =>
                  dispatch({ type: "SET_SORTING", payload: value })
                }
                isRefetching={isRefetching}
              />

              <Feed
                key={mergePages(data.pages)}
                submissions={
                  flairList.length && state.shownFlair.length
                    ? mergePages(data.pages).filter((post) =>
                        state.shownFlair.includes(post.link_flair_text)
                      )
                    : mergePages(data.pages)
                }
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </Box>
          </Box>
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
  (store) =>
    async ({ req, query }) => {
      const { subreddit } = query;
      const token = await getToken({ req });

      let subredditInfoRes;
      let flairRes;
      if (token?.accessToken) {
        [subredditInfoRes, flairRes] = await Promise.all([
          fetch(
            `https://oauth.reddit.com/r/${subreddit}/about.json?raw_json=1`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            }
          ),
          fetch(
            `https://oauth.reddit.com/r/${subreddit}/api/link_flair_v2?raw_json=1`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            }
          ),
        ]);
      } else {
        subredditInfoRes = await fetch(
          `https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`
        );
      }
      const subredditInfo = await subredditInfoRes.json();
      const flairList = await flairRes?.json();
      return {
        props: {
          subreddit: subredditInfo.data,
          flairList,
        },
      };
    }
);
