import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { ArrowLeft } from "tabler-icons-react";
import { Button, createStyles } from "@mantine/core";
import Layout from "src/components/Layout";
import CommentSection from "src/components/Comment/CommentSection";
import PostCard from "src/components/Post/PostCard";
import SidebarContainer from "src/components/Navigation/SidebarContainer";
import {
  SubredditRules,
  SubredditBanner,
  SubredditAbout,
} from "src/components/Subreddit";
import { wrapper } from "src/store/store";
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

function Comment({ commentId, post, subreddit }) {
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
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
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
            <CommentSection
              post={post}
              commentId={commentId}
              variant="single"
            />
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

export default Comment;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, context }) => {
      const { id } = context.query;
      const commentRes = await fetch(
        `https://www.reddit.com/api/info.json?id=t1_${id}`
      );
      const comment = await commentRes.json();
      const postRes = await fetch(
        `https://www.reddit.com/api/info.json?id=${comment.data.children[0].data.link_id}&raw_json=1`
      );
      const post = await postRes.json();
      const repliesRes = await fetch(
        `https://www.reddit.com/comments/${post.data.children[0].data.id}.json?comment=${id}&limit=50&depth=10&sort=top`
      );
      const replies = await repliesRes.json();

      const getSubredditInfo = await import(
        "../../services/Subreddit/server"
      ).then((mod) => mod.getSubredditInfo);
      const subreddit = await getSubredditInfo(
        post.data.children[0].data.subreddit
      );

      return {
        props: {
          commentId: id,
          post: post.data.children[0].data,
          replies: replies[1].data.children,
          subreddit: subreddit.data,
        },
      };
    }
);
