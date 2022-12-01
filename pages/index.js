import { useEffect, useReducer } from "react";
import { Text, createStyles } from "@mantine/core";
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import Feed from "../src/components/Feed/Feed";
import FeedControls from "../src/components/Feed/FeedControls";
import Layout from "../src/components/Layout";
import Head from "next/head";
import { fetchPosts, mergePages } from "../utils";
import LoadingScreen from "../src/components/LoadingScreen";
import TrendingSubsCard from "../src/components/TrendingSubsCard";
import SidebarContainer from "../src/components/Navigation/SidebarContainer";

import { useSelector } from "react-redux";

import { useAppDispatch, wrapper } from "../store/store";
import {
  setAuthenticationStatus,
  selectAuthentication,
} from "../store/AuthSlice";
import { selectDemoUser, selectVisitedPosts } from "../store/DemoUserSlice";
import RecentlyVisitedCard from "../src/components/Sidebar/RecentlyVisitedCard";

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

const initialState = { sorting: "hot" };

function reducer(state, action) {
  switch (action.type) {
    case "SET_SORTING":
      return { ...state, sorting: action.payload };
    default:
      return initialState;
  }
}

export default function Home() {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const recentVisits = useSelector(selectVisitedPosts);
  const demoUser = useSelector(selectDemoUser);

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
        state.sorting,
        demoUser.subscribedSubreddits.join("+"),
        10,
        pageParam
      ),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.after;
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [state.sorting, refetch, demoUser.subscribedSubreddits]);

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
      <Layout>
        <div className={classes.main}>
          <SidebarContainer>
            <TrendingSubsCard />
            {recentVisits.length > 0 ? (
              <RecentlyVisitedCard posts={recentVisits} />
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
              posts={mergePages(data.pages)}
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
