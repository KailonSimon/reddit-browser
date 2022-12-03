import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { ArrowLeft } from "tabler-icons-react";
import { Button, createStyles } from "@mantine/core";
import Layout from "../../src/components/Layout";
import CommentSection from "../../src/components/Comment/CommentSection";
import PostCard from "../../src/components/Post/PostCard";
import SidebarContainer from "../../src/components/Navigation/SidebarContainer";
import SubredditRules from "../../src/components/Subreddit/SubredditRules";
import SubredditSidebar from "../../src/components/SubredditSidebar";
import SubredditBanner from "../../src/components/SubredditBanner";
import ContentWarningModal from "../../src/components/Modals/ContentWarningModal";
import { getSubredditInfo } from "../../utils";

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

  const handleCloseModal = () => {
    setContentWarningModalOpen(false);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        <SubredditBanner subreddit={subreddit} />
        <div className={classes.controlsWrapper}>
          <Link href={`/sub/${subreddit.display_name}`} passHref>
            <Button component="a" variant="subtle" leftIcon={<ArrowLeft />}>
              Go to {subreddit.display_name_prefixed}
            </Button>
          </Link>
        </div>
        <div className={classes.content}>
          <SidebarContainer>
            <SubredditSidebar subreddit={subreddit} />
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

export async function getServerSideProps(context) {
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
