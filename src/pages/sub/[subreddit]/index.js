import { useEffect, useState, useReducer } from "react";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { wrapper } from "src/store/store";
import { selectAuthentication } from "src/store/AuthSlice";
import LoadingScreen from "src/components/LoadingScreen";
import SidebarContainer from "src/components/Navigation/SidebarContainer";
import Layout from "src/components/Layout";
import {
  SubredditBanner,
  SubredditAbout,
  SubredditRules,
} from "src/components/Subreddit";
import { mergePages } from "src/services/Format/API";
import { createStyles, Box, Text } from "@mantine/core";
import { fetchPosts } from "src/services/Posts/client";
import dynamic from "next/dynamic";

const ContentWarningModal = dynamic(() =>
  import("../../../components/Modals/ContentWarningModal")
);
const Feed = dynamic(() => import("../../../components/Feed/Feed"));

const FeedControls = dynamic(() =>
  import("../../../components/Feed/FeedControls")
);
const SubredditFlairFilter = dynamic(() =>
  import("../../../components/Subreddit/SubredditFlairFilter")
);

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

function Subreddit({ subreddit, flairList, currentUser }) {
  const { classes } = useStyles();
  const [contentWarningModalOpen, setContentWarningModalOpen] = useState(
    subreddit.over18
  );
  const authentication = useSelector(selectAuthentication);
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn();
    }
  }, [session]);

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
        <Layout currentUser={currentUser}>
          <SubredditBanner subreddit={subreddit} />
          <Box className={classes.content}>
            <SidebarContainer>
              <SubredditAbout subreddit={subreddit} />
              {flairList?.length > 0 && (
                <SubredditFlairFilter
                  flairList={flairList}
                  setFlairFilter={(values) =>
                    dispatch({ type: "SET_FLAIR_FILTER", payload: values })
                  }
                  shownFlair={state.shownFlair}
                />
              )}
              <SubredditRules subreddit={subreddit} />
            </SidebarContainer>
            {data.pages.length > 0 && (
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
                    flairList?.length && state.shownFlair?.length
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
            )}
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

      const getSubredditInfo = await import(
        "../../../services/Subreddit/server"
      ).then((mod) => mod.getSubredditInfo);
      const subredditInfo = (
        await getSubredditInfo(subreddit, token?.accessToken)
      ).data;

      let flairList;
      let currentUser;

      if (token?.accessToken) {
        const getSubredditFlair = await import(
          "../../../services/Subreddit/server"
        ).then((mod) => mod.getSubredditFlair);
        flairList = await getSubredditFlair(subreddit, token.accessToken);

        const getCurrentUserData = await import(
          "../../../services/User/server"
        ).then((mod) => mod.getCurrentUserData);
        currentUser = (await getCurrentUserData(token.accessToken)).data;
      }

      return {
        props: {
          subreddit: subredditInfo,
          flairList: flairList || null,
          currentUser: currentUser || store.getState().demoUser,
        },
      };
    }
);
