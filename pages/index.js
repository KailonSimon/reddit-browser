import { useEffect, useReducer } from "react";
import { Text } from "@mantine/core";
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
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
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["posts", state.sorting],
    ({ pageParam = "" }) => fetchPosts(state.sorting, "all", 10, pageParam),
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

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchInfiniteQuery(["posts"], ({ pageParam = "" }) =>
      fetchPosts("hot", "all", 5, pageParam)
    );
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
