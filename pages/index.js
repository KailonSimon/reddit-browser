import { useEffect, useReducer } from "react";
import { Text } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";

import FeedControls from "../src/components/FeedControls";
import Feed from "../src/components/Feed";
import Layout from "../src/components/Layout";
import Head from "next/head";
import { mergePages } from "../utils";
import LoadingScreen from "../src/components/LoadingScreen";

const initialState = { subreddit: null, sorting: "hot" };

function reducer(state, action) {
  switch (action.type) {
    case "SET_SUBREDDIT":
      return { ...state, subreddit: action.payload };
    case "SET_SORTING":
      return { ...state, sorting: action.payload };
    default:
      return initialState;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchPosts = async ({ pageParam = "" }) => {
    let res;
    if (state.subreddit) {
      res = await fetch(
        `https://www.reddit.com/r/${state.subreddit}/${state.sorting}.json?limit=25&after=${pageParam}`
      );
    } else {
      res = await fetch(
        `https://www.reddit.com/r/all/${state.sorting}.json?limit=25&after=${pageParam}`
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
  }, [state.subreddit, state.sorting, refetch]);

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
          subreddit={state.subreddit}
          setSubreddit={(value) =>
            dispatch({ type: "SET_SUBREDDIT", payload: value })
          }
          sorting={state.sorting}
          setSorting={(value) =>
            dispatch({ type: "SET_SORTING", payload: value })
          }
          isRefetching={isRefetching}
        />

        <Feed
          key={mergePages(data.pages)}
          setSubreddit={(value) =>
            dispatch({ type: "SET_SUBREDDIT", payload: value })
          }
          posts={mergePages(data.pages)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </Layout>
    </>
  );
}
