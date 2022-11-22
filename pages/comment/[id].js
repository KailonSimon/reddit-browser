import { Button, createStyles } from "@mantine/core";
import Link from "next/link";
import { ArrowLeft } from "tabler-icons-react";
import Head from "next/head";
import Layout from "../../src/components/Layout";
import CommentSection from "../../src/components/Comment/CommentSection";
import PostCard from "../../src/components/Post/PostCard";

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
    padding: "5rem 1rem 1rem",
  },
  controlsWrapper: {
    width: "100%",
    display: "flex",
  },
}));

function Comment({ commentId, post }) {
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        <>
          <div className={classes.container}>
            <div className={classes.controlsWrapper}>
              <Link href={"/"} passHref>
                <Button component="a" variant="subtle" leftIcon={<ArrowLeft />}>
                  Go to feed
                </Button>
              </Link>
            </div>
            <PostCard post={post} />
            <CommentSection post={post} commentId={commentId} />
          </div>
        </>
      </Layout>
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
    `https://www.reddit.com/api/info.json?id=${comment.data.children[0].data.link_id}`
  );
  const post = await postRes.json();
  const repliesRes = await fetch(
    `https://www.reddit.com/comments/${post.data.children[0].data.id}.json?comment=${id}&limit=50&depth=10&sort=top`
  );
  const replies = await repliesRes.json();

  return {
    props: {
      commentId: id,
      post: post.data.children[0].data,
      replies: replies[1].data.children,
    },
  };
}
