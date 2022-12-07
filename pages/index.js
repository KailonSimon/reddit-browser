import { useEffect, useReducer, useState } from "react";
import { Text, createStyles } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import Feed from "../src/components/Feed/Feed";
import FeedControls from "../src/components/Feed/FeedControls";
import Layout from "../src/components/Layout";
import Head from "next/head";
import {
  fetchPosts,
  getApplicationAccessToken,
  getCurrentUserData,
  getSubscribedSubreddits,
  getTrendingSubreddits,
  mergePages,
} from "../utils";
import LoadingScreen from "../src/components/LoadingScreen";
import TrendingSubsCard from "../src/components/TrendingSubsCard";
import SidebarContainer from "../src/components/Navigation/SidebarContainer";
import { useSelector } from "react-redux";
import { selectAuthentication } from "../store/AuthSlice";
import { selectDemoUser, selectVisitedPosts } from "../store/DemoUserSlice";
import RecentlyVisitedCard from "../src/components/Sidebar/RecentlyVisitedCard";
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { wrapper } from "../store/store";

const useStyles = createStyles((theme) => ({
  main: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    width: "100%",
    padding: "0 1rem",
    marginTop: "5rem",

    [theme.fn.smallerThan("md")]: {
      justifyContent: "center",
      padding: "0 0.5rem",
    },
  },
}));

const initialState = { sorting: "hot", recentlyVisitedPosts: [] };

function reducer(state, action) {
  switch (action.type) {
    case "SET_SORTING":
      return { ...state, sorting: action.payload };
    case "SET_RECENTLY_VISITED_POSTS":
      return { ...state, recentlyVisitedPosts: action.payload };
    default:
      return initialState;
  }
}

export default function Home({
  subscribedSubreddits,
  trendingSubreddits,
  currentUser,
}) {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const visitedPosts = useSelector(selectVisitedPosts);
  const demoUser = useSelector(selectDemoUser);
  const authentication = useSelector(selectAuthentication);
  const { data: session } = useSession();

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
    ({ pageParam }) =>
      fetchPosts(
        session ? null : demoUser.subscribedSubreddits.join("+"),
        state.sorting,
        10,
        pageParam
      ),
    {
      enabled: authentication.status !== "unauthenticated",
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.after;
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [state.sorting, refetch, demoUser.subscribedSubreddits]);

  useEffect(() => {
    dispatch({
      type: "SET_RECENTLY_VISITED_POSTS",
      payload: visitedPosts.slice(0, 5),
    });
  }, [visitedPosts]);

  return status === "loading" && !data ? (
    <LoadingScreen /> || !data
  ) : status === "error" ? (
    <Text>Error: {error.message}</Text>
  ) : (
    <>
      <Head>
        <title>Reddit Browser | Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="Reddit Browser | Home" />
      </Head>
      <Layout currentUser={currentUser}>
        <div className={classes.main}>
          <SidebarContainer>
            {trendingSubreddits?.length ? (
              <TrendingSubsCard
                trendingSubreddits={trendingSubreddits}
                subscribedSubreddits={subscribedSubreddits}
              />
            ) : null}
            {state.recentlyVisitedPosts.length ? (
              <RecentlyVisitedCard
                posts={state.recentlyVisitedPosts}
                handleClearPosts={() =>
                  dispatch({ type: "SET_RECENTLY_VISITED_POSTS", payload: [] })
                }
              />
            ) : null}
          </SidebarContainer>
          <div
            style={{
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
              submissions={mergePages(data.pages)}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      const token = await getToken({ req });
      let subscribedSubreddits;
      let currentUser;

      if (token?.accessToken) {
        currentUser = (await getCurrentUserData(token.accessToken)).data;
        subscribedSubreddits = (
          await getSubscribedSubreddits(token.accessToken)
        ).data.children?.map((subreddit) => subreddit.data.display_name);
      }

      const trendingSubreddits = (
        await getTrendingSubreddits(token?.accessToken)
      ).data?.children.map((subreddit) => subreddit.data);

      return {
        props: {
          subscribedSubreddits: subscribedSubreddits || null,
          trendingSubreddits: trendingSubreddits || null,
          currentUser: currentUser || store.getState().demoUser,
        },
      };
    }
);
