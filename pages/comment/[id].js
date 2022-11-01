import { Button, createStyles } from "@mantine/core";
import Link from "next/link";
import { ArrowLeft } from "tabler-icons-react";
import Layout from "../../src/components/Layout";
import CommentSection from "../../src/components/CommentSection";
import Head from "next/head";
import PostCard from "../../src/components/PostCard";

const useStyles = createStyles((theme) => ({
  container: {
    maxWidth: 600,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.5rem",
  },
  details: {
    display: "flex",
    alignItems: "center",
    flexFlow: "row wrap",
    margin: "0 0 4px",
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
            <Link href={"/"} passHref>
              <Button component="a" variant="subtle" leftIcon={<ArrowLeft />}>
                Go to feed
              </Button>
            </Link>
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
