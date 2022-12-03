import { useEffect, useReducer } from "react";
import { Text, createStyles } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import Feed from "../src/components/Feed/Feed";
import FeedControls from "../src/components/Feed/FeedControls";
import Layout from "../src/components/Layout";
import Head from "next/head";
import { fetchPosts, mergePages } from "../utils";
import LoadingScreen from "../src/components/LoadingScreen";
import TrendingSubsCard from "../src/components/TrendingSubsCard";
import SidebarContainer from "../src/components/Navigation/SidebarContainer";
import { useSelector } from "react-redux";
import { selectAuthentication } from "../store/AuthSlice";
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

export default function Home() {
  const { classes } = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const visitedPosts = useSelector(selectVisitedPosts);
  const demoUser = useSelector(selectDemoUser);
  const authentication = useSelector(selectAuthentication);

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
      <Layout>
        <div className={classes.main}>
          <SidebarContainer>
            <TrendingSubsCard />
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
