import { Button, createStyles } from "@mantine/core";
import Link from "next/link";
import { ArrowLeft } from "tabler-icons-react";
import Head from "next/head";
import Layout from "../../src/components/Layout";
import CommentSection from "../../src/components/Comment/CommentSection";
import PostCard from "../../src/components/Post/PostCard";
import { getSubredditInfo } from "../../utils";
import SidebarContainer from "../../src/components/Navigation/SidebarContainer";
import SubredditRules from "../../src/components/Subreddit/SubredditRules";
import { useEffect } from "react";
import SubredditSidebar from "../../src/components/SubredditSidebar";
import SubredditBanner from "../../src/components/SubredditBanner";

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
}));

function Post({ post, subreddit }) {
  const { classes } = useStyles();

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
      <Layout>
        <SubredditBanner subreddit={subreddit} />

        <div className={classes.controlsWrapper}>
          <Link href={`/sub/${subreddit.display_name}`} passHref>
            <Button component="a" variant="subtle" leftIcon={<ArrowLeft />}>
              Go to {subreddit.display_name_prefixed}
            </Button>
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <SidebarContainer>
            <SubredditSidebar subreddit={subreddit} />
            <SubredditRules subreddit={subreddit} />
          </SidebarContainer>
          <div className={classes.container}>
            <PostCard post={post} />
            <CommentSection post={post} />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Post;

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await fetch(`https://www.reddit.com/api/info.json?id=t3_${id}`);
  const post = await res.json();
  const subreddit = await getSubredditInfo(
    post.data.children[0].data.subreddit
  );

  return {
    props: { post: post.data.children[0].data, subreddit: subreddit.data },
  };
}
