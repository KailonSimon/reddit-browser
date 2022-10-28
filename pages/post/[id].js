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
        <>
          <div className={classes.container}>
            <Link href={"/"} passHref>
              <Button component="a" variant="subtle" leftIcon={<ArrowLeft />}>
                Go to feed
              </Button>
            </Link>
            <PostCard post={post} />
            <CommentSection postId={post.id} />
          </div>
        </>
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
