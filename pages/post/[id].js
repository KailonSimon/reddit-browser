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

function Post({ post }) {
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
        <div className={classes.container}>
          <div className={classes.controlsWrapper}>
            <Link href={"/"} passHref>
              <Button component="a" variant="subtle" leftIcon={<ArrowLeft />}>
                Go back
              </Button>
            </Link>
          </div>
          <PostCard post={post} />
          <CommentSection post={post} />
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

  return { props: { post: post.data.children[0].data } };
}
