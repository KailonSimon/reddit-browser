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
import InfoCard from "../src/components/InfoCard";

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
    ({ pageParam = "" }) => fetchPosts(state.sorting, "all", 10, pageParam),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.after;
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [state.sorting, refetch]);

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
        <div className={classes.main}>
          <SidebarContainer>
            <TrendingSubsCard />
          </SidebarContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "0 1rem",
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

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchInfiniteQuery(
      ["posts"],
      ({ pageParam = "" }) => fetchPosts("hot", "all", 5, pageParam),
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
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
