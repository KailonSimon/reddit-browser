import { useEffect, useReducer } from "react";
import { Text } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import FeedControls from "../src/components/FeedControls";
import Feed from "../src/components/Feed";
import Layout from "../src/components/Layout";
import Head from "next/head";
import { fetchPosts, mergePages } from "../utils";
import LoadingScreen from "../src/components/LoadingScreen";

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
    ["posts"],
    ({ pageParam = "" }) => fetchPosts(state.sorting, "all", pageParam),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.after;
      },
    }
  );

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
      </Layout>
    </>
  );
}
