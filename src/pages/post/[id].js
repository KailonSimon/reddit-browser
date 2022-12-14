import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { Button, createStyles } from "@mantine/core";
import { ArrowLeft } from "tabler-icons-react";
import Layout from "src/components/Layout";
import CommentSection from "src/components/Comment/CommentSection";
import PostCard from "src/components/Post/PostCard";
import SidebarContainer from "src/components/Navigation/SidebarContainer";
import {
  SubredditBanner,
  SubredditAbout,
  SubredditRules,
} from "src/components/Subreddit";
import { wrapper } from "src/store/store";
import { getToken } from "next-auth/jwt";
import dynamic from "next/dynamic";

const ContentWarningModal = dynamic(() =>
  import("../../components/Modals/ContentWarningModal")
);

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    position: "relative",
    [theme.fn.smallerThan(800)]: {
      minWidth: 300,
    },
    background: theme.colorScheme === "dark" ? "#1A1A1B" : "#fff",
    border: `1px solid ${
      theme.colorScheme === "dark" ? "#474748" : theme.colors.gray[4]
    }`,
    borderRadius: 4,
  },
  controlsWrapper: {
    width: "100%",
    display: "flex",
    padding: "1rem",
  },
  content: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "center",
    width: "100%",
    padding: "0 1rem 8rem",
    [theme.fn.smallerThan("md")]: {
      padding: "0 0.5rem 8rem",
    },
  },
}));

function Post({ post, subreddit, currentUser }) {
  const { classes } = useStyles();
  const [contentWarningModalOpen, setContentWarningModalOpen] = useState(
    post.over_18
  );
  const { data: session } = useSession();

  const handleCloseModal = () => {
    setContentWarningModalOpen(false);
  };

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn();
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={post.title} />
        {post.post_hint == "image" && (
          <meta property="og:image" content={post.url} />
        )}
      </Head>
      <Layout currentUser={currentUser}>
        <SubredditBanner subreddit={subreddit} />

        <div className={classes.controlsWrapper}>
          <Link href={`/sub/${subreddit.display_name}`} passHref>
            <Button variant="subtle" leftIcon={<ArrowLeft />}>
              Go to {subreddit.display_name_prefixed}
            </Button>
          </Link>
        </div>
        <div className={classes.content}>
          <SidebarContainer>
            <SubredditAbout subreddit={subreddit} />
            <SubredditRules subreddit={subreddit} />
          </SidebarContainer>
          <div className={classes.container}>
            <PostCard post={post} />
            <CommentSection post={post} />
          </div>
        </div>
      </Layout>
      <ContentWarningModal
        open={contentWarningModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}

export default Post;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      const { id } = query;
      const token = await getToken({ req });

      const getPostInfo = await import("../../services/Posts/server").then(
        (mod) => mod.getPostInfo
      );
      const post = (await getPostInfo(id, token?.accessToken)).data;

      const getSubredditInfo = await import(
        "../../services/Subreddit/server"
      ).then((mod) => mod.getSubredditInfo);
      const subreddit = (
        await getSubredditInfo(
          post.children[0].data.subreddit,
          token?.accessToken
        )
      ).data;

      let currentUser;

      if (token?.accessToken) {
        const getCurrentUserData = await import(
          "../../services/User/server"
        ).then((mod) => mod.getCurrentUserData);
        currentUser = (await getCurrentUserData(token.accessToken)).data;
      }

      return {
        props: {
          post: post.children[0].data,
          subreddit,
          currentUser: currentUser || store.getState().demoUser,
        },
      };
    }
);
